import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen text-surface-150 flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#060e1e' }}>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-light/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-4.5 h-4.5 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-surface-50">CardWise</span>
              <span className="text-[9px] bg-accent/15 border border-accent/25 text-accent font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest">AI</span>
            </div>
          </Link>
          <p className="text-sm text-surface-400 font-medium">Welcome back! Sign in to optimize your benefits.</p>
        </div>

        <Card className="space-y-6 border border-surface-800/40 p-6 md:p-8 glass-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 p-3 bg-danger/10 border border-danger/20 text-danger text-xs font-semibold rounded-xl animate-fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 text-danger" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4 text-surface-500" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4 text-surface-500" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-accent hover:text-accent-light font-bold transition-colors uppercase tracking-wider">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full font-bold" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-surface-800/60"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold text-surface-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-surface-800/60"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full text-xs font-bold py-2.5" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-xs font-bold py-2.5" 
              onClick={handleDemoSignIn}
              disabled={loading}
            >
              Guest Demo
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-surface-500 font-semibold uppercase tracking-wider">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent hover:text-accent-light font-bold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
