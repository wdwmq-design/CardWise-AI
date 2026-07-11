# CardWise AI — AI-Powered Credit Card Benefits Advisor

> **"CardWise AI tells you which card to swipe, before you swipe it — and shows you exactly how much money that decision just saved you."**

Built for the **TechForge Ideathon**, CardWise AI is a premium credit card optimization dashboard and AI purchase assistant designed to maximize rewards, cashback, and lounge access for Indian credit cards.

---

## Key Features

1. **AI Purchase Advisor**: Type transaction details in natural language (e.g. *"Buying a laptop for ₹55,000 on Amazon"*), and receive immediate calculation of cashback, reward points, points value, and a tailored AI recommendation on which card to use.
2. **Side-by-Side Comparison Engine**: Compare all your credit cards side-by-side for a specific purchase amount and category.
3. **Contextual AI Chatbot**: Chat with an assistant grounded in your active wallet cards to ask questions like *"Why not my Axis card for my last purchase?"* or *"Show domestic lounge access rules for my cards."*
4. **Benefit Health Score**: An interactive visual metric (0–100) scoring the coverage and optimization of your credit card wallet.
5. **AI Wallet Manager**: Easily add and remove cards from a database of 10 major Indian credit cards (HDFC Millennia, HDFC Infinia, SBI Cashback, Axis ACE, Amex MRCC, etc.).

---

## Architecture & Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS v4 + Motion
- **Backend**: Node.js + Express + TypeScript + OpenAI API (JSON Mode & Chat Completions)
- **Data Layer**: Firebase Firestore (for user wallet syncing) + LocalStorage (for offline fallback)

---

## Quick Start

### 1. Installation
Install all root, client, and server dependencies with a single command:
```bash
npm run install:all
```

### 2. Local Development (Concurrent Mode)
Start both the Express backend server (port `3001`) and the Vite React frontend dev server (port `5173`) concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build & Production Check
Ensure everything compiles and bundles cleanly:
```bash
npm run build
```

---

## Environment Configuration

Both frontend and backend operate in a **Mock/Offline fallback mode** by default if credentials are not configured, so the application runs perfectly out-of-the-box.

To connect live Firebase and OpenAI APIs, update the environment variables:

### Client Credentials (`client/.env`)
Create a `client/.env` file with your Firebase web configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Server Credentials (`server/.env`)
Create a `server/.env` file:
```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```
