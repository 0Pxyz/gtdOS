'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        // Here you would integrate with Supabase to verify the email
        // const { error } = await supabase.auth.verifyOtp({
        //   token_hash: token,
        //   type: type as any,
        // })

        // if (error) {
        //   setStatus("error")
        //   setMessage(error.message)
        //   return
        // }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-6 bg-black/40 backdrop-blur-xl rounded-lg border border-white/10 text-white"
      >
        <div className="text-center">
          {status === 'loading' && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="h-12 w-12 rounded-full bg-green-500/20 mx-auto mb-4 flex items-center justify-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="h-12 w-12 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center"
            >
              <XCircle className="h-8 w-8 text-red-500" />
            </motion.div>
          )}

          <h2 className="text-xl font-bold mb-2">Email Verification</h2>
          <p className="text-white/70 mb-6">{message}</p>

          {status === 'error' && (
            <Button onClick={() => router.push('/')}>Return to Login</Button>
          )}

          {status === 'success' && (
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
