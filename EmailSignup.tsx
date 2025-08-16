import React, { useState } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';

interface EmailSignupProps {
  onSignupComplete?: (email: string) => void;
}

export function EmailSignup({ onSignupComplete }: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      // Here you would integrate with your email service (Mailchimp, ConvertKit, etc.)
      // For now, we'll simulate a successful signup
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll always succeed
      // In production, this would call your email service API
      const success = await simulateEmailSignup(email);
      
      if (success) {
        setStatus('success');
        setMessage('Successfully signed up! You\'ll receive daily poetry via email.');
        setEmail('');
        setShowForm(false);
        
        // Store signup in localStorage
        localStorage.setItem('emailSignup', JSON.stringify({
          email,
          signedUp: true,
          date: new Date().toISOString()
        }));
        
        if (onSignupComplete) {
          onSignupComplete(email);
        }
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to sign up. Please try again later.');
      console.error('Email signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateEmailSignup = async (email: string): Promise<boolean> => {
    // This would be replaced with actual API call to your email service
    console.log('Signing up email:', email);
    
    // You could integrate with services like:
    // - Mailchimp API
    // - ConvertKit API
    // - EmailJS
    // - Your own backend endpoint
    
    return true; // Simulate success
  };

  // Check if user has already signed up
  const existingSignup = localStorage.getItem('emailSignup');
  const isAlreadySignedUp = existingSignup ? JSON.parse(existingSignup).signedUp : false;

  if (isAlreadySignedUp && status !== 'success') {
    return (
      <div className="text-center w-full">
        <div className="inline-flex items-center justify-center space-x-2 text-emerald-deep text-sm">
          <Check size={16} />
          <span>Email notifications active</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('emailSignup');
            window.location.reload();
          }}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors mt-1 block mx-auto underline"
        >
          Update preferences
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {!showForm ? (
        <div className="flex justify-center w-full">
          <button
            onClick={() => setShowForm(true)}
            className="
              group flex items-center justify-center space-x-2 px-4 py-2
              text-gold-accent hover:text-emerald-deep
              transition-colors duration-200
              border border-gold-accent/30 hover:border-emerald-deep/30
              rounded-full text-sm
              hover:bg-white/50
              mx-auto
            "
          >
            <Mail size={16} />
            <span>Get daily poems via email</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                className="text-center text-sm w-full"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="flex-1 bg-emerald-deep hover:bg-emerald-deep/90 text-white text-xs"
              >
                {isSubmitting ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Signing up...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEmail('');
                  setStatus('idle');
                  setMessage('');
                }}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <X size={14} />
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-text-secondary opacity-75 text-center">
            Receive beautiful daily poetry in your inbox. Unsubscribe anytime.
          </p>
        </div>
      )}
      
      {/* Status Messages */}
      {(status === 'success' || status === 'error') && (
        <div className="mt-3 w-full max-w-sm">
          <Alert className={status === 'error' ? 'border-red-500' : 'border-green-500'}>
            <AlertDescription className={`text-xs text-center ${status === 'error' ? 'text-red-700' : 'text-green-700'}`}>
              {message}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}