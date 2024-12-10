'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }

      if (data) {
        router.refresh();
      }
    } catch (error) {
      console.error(`Error during ${provider} OAuth sign-in:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader className="space-y-2 p-6">
            <div className="flex flex-col items-center gap-2">
            <Mail className="text-[#FF6C37] w-6 h-6" />
            <CardTitle className="text-xl font-semibold text-center">Welcome to NextInBox</CardTitle>
            </div>
            <CardDescription className="text-gray-500 text-center">
            Sign in to continue
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            variant="outline"
            className="w-full border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-md text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 group"
          >
            <Github className="mr-2 h-5 w-5 text-[#FF6C37] group-hover:scale-110 transition-transform duration-300" />
            Continue with GitHub
          </Button>
          <Button
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            variant="outline"
            className="w-full border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-md text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 group"
          >
            <Mail className="mr-2 h-5 w-5 text-[#FF6C37] group-hover:scale-110 transition-transform duration-300" />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="p-6 pt-2 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-[#FF6C37] hover:text-[#FF6C37]/80 font-medium">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#FF6C37] hover:text-[#FF6C37]/80 font-medium">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}