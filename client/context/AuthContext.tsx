"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isMock: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  simulateEmailVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const isMock = false;

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            setUser({
              uid: session.user.id,
              email: session.user.email ?? null,
              displayName: session.user.user_metadata?.full_name ?? null,
              emailVerified: !!session.user.email_confirmed_at,
              photoURL: session.user.user_metadata?.avatar_url ?? null,
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email ?? null,
          displayName: session.user.user_metadata?.full_name ?? null,
          emailVerified: !!session.user.email_confirmed_at,
          photoURL: session.user.user_metadata?.avatar_url ?? null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const sendVerificationEmail = async () => {
    // Supabase sends this automatically on sign up if enabled in dashboard.
    // To manually resend:
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
    }
  };

  const simulateEmailVerification = () => {
    console.warn("simulateEmailVerification is not supported in real Supabase mode. Please verify via email link.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMock,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resetPassword,
        sendVerificationEmail,
        simulateEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
