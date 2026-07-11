import { OpenAI } from 'openai';
import { CreditCard, CardSavings, ChatMessage } from '../types/index.js';

const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

if (apiKey && apiKey !== 'your-key-here') {
  openai = new OpenAI({ apiKey });
}

export async function getRecommendation(
  query: string,
  amount: number,
  category: string,
  merchant: string,
  primaryRecommendation: CardSavings,
  alternatives: CardSavings[]
): Promise<{ bestCard: { cardId: string; reason: string }; alternatives: Array<{ cardId: string; tradeoff: string }> }> {
  const bestCard = primaryRecommendation.card;

  // 1. Check if OpenAI is configured. If not, use local mock generator
  if (!openai) {
    let mockReason = `We recommend swiping the ${bestCard.name} because it gives you `;
    if (primaryRecommendation.appliedBonus) {
      mockReason += `a specialized ${primaryRecommendation.appliedBonus} of ${(bestCard.cashbackRate[merchant] || bestCard.cashbackRate[category] || bestCard.cashbackRate.default)}%`;
    } else {
      mockReason += `its default cashback rate of ${bestCard.cashbackRate.default}%`;
    }
    mockReason += ` on this purchase. This yields ₹${primaryRecommendation.cashback.toFixed(2)} cashback plus ${primaryRecommendation.rewardPoints} reward points (value: ₹${primaryRecommendation.rewardValue.toFixed(2)}), giving you a total saving of ₹${primaryRecommendation.totalBenefit.toFixed(2)}.`;

    if (bestCard.annualFee > 0 && bestCard.feeWaiverCriteria) {
      mockReason += ` Plus, this transaction counts towards waiving your annual fee (waives at ${bestCard.feeWaiverCriteria}).`;
    }

    const mockAlts = alternatives.map(alt => {
      let tradeoff = '';
      if (alt.totalBenefit < primaryRecommendation.totalBenefit) {
        tradeoff = `Saves you ₹${(primaryRecommendation.totalBenefit - alt.totalBenefit).toFixed(2)} less because of lower category bonuses.`;
      } else {
        tradeoff = `Equally high benefits but does not count towards fee waiver goals.`;
      }
      return {
        cardId: alt.cardId,
        tradeoff
      };
    });

    return {
      bestCard: {
        cardId: bestCard.id,
        reason: mockReason
      },
      alternatives: mockAlts
    };
  }

  // 2. OpenAI SDK API call with JSON Mode
  try {
    const prompt = `
      You are CardWise AI, a credit card benefit optimizer.
      User is buying: "${query}" (Amount: ₹${amount}, Category: "${category}", Merchant: "${merchant}").
      
      Recommended Card: ${bestCard.name} (Bank: ${bestCard.bank}).
      Calculated savings for recommended card: ₹${primaryRecommendation.totalBenefit} (Cashback: ₹${primaryRecommendation.cashback}, Reward Points value: ₹${primaryRecommendation.rewardValue}).
      Key benefits of recommended card: ${bestCard.highlights.join(', ')}.

      Alternatives:
      ${alternatives.map(alt => `- ${alt.card.name}: yields ₹${alt.totalBenefit} total benefit. Tradeoffs: ${alt.card.highlights.join(', ')}`).join('\n')}

      Generate a brief 2-4 sentence explanation of why the recommended card is the absolute best choice. Refer to actual percentages and Indian Rupee figures. Do not fabricate figures.
      Also, for each alternative, write a short 1-sentence tradeoff explanation.

      Return the response in this exact JSON schema:
      {
        "bestCard": {
          "cardId": "${bestCard.id}",
          "reason": "explanation string"
        },
        "alternatives": [
          {
            "cardId": "alternative-card-id",
            "tradeoff": "tradeoff string"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(resultText);
  } catch (err) {
    console.error('Error calling OpenAI API:', err);
    throw err;
  }
}

export async function chatResponse(
  messages: ChatMessage[],
  userCards: CreditCard[]
): Promise<string> {
  const walletSummary = userCards.map(c => `- ${c.name} (${c.bank}): ${c.highlights.join(', ')}`).join('\n');

  if (!openai) {
    // Local fallback chatbot responder matching wallet context
    const latestMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (latestMessage.includes('axis')) {
      return "Your Axis card (such as Axis ACE) offers 2% default cashback, which is excellent for general offline transactions. However, for online categories, SBI Cashback offers 5% online shopping cashback, which directly beats the 2% default rate by ₹2,400 on large ₹80,000 purchases. That is why the SBI Cashback card was selected as the optimal choice.";
    }
    if (latestMessage.includes('dining') || latestMessage.includes('zomato') || latestMessage.includes('swiggy')) {
      return "For dining, Axis ACE gives 4% cashback on Swiggy and Zomato. ICICI Sapphiro gives 4 reward points per ₹100 spend. HDFC Millennia offers 5% cashback on Swiggy transactions via the SmartBuy portal. I recommend Swiping HDFC Millennia if shopping online, or Axis ACE for direct restaurant bills.";
    }
    if (latestMessage.includes('lounge')) {
      return "Based on your active wallet:\n- HDFC Millennia offers 8 complimentary domestic lounge visits/year.\n- SBI Cashback offers 4 domestic visits/year.\n- Axis ACE offers 4 domestic visits/year.\nYou have a total pool of 16 domestic lounge visits available across your wallet cards.";
    }
    
    return "To maximize your benefits, always map online shopping to your SBI Cashback card (5% back), utilities and bills to Axis ACE via Google Pay (5% back), and grocery orders on Blinkit/Zepto to HDFC Millennia (5% back via SmartBuy). Let me know if you want to compare card details for a specific transaction!";
  }

  try {
    const systemPrompt = `
      You are CardWise AI, a credit card benefit optimizer.
      The user owns the following credit cards:
      ${walletSummary}

      Answer the user's questions about their cards, rewards, features, lounge benefits, or fee waivers.
      Rules:
      - Limit response to 2-4 sentences. Be concise and direct.
      - Ground your advice in their actual owned cards.
      - Keep a premium, professional, and helpful tone.
      - Refer to Indian Rupee symbol (₹).
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    });

    return chatCompletion.choices[0]?.message?.content || "I couldn't process that question right now. Please try again.";
  } catch (err) {
    console.error('Error in chat API:', err);
    return "I am currently running in offline local mode and encountered an error connecting to my AI core. Please check your internet connection.";
  }
}
