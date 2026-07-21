"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword as fbSignIn,
  createUserWithEmailAndPassword as fbCreateUser,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbResetPassword,
  sendEmailVerification as fbSendVerification,
  signInWithPopup as fbSignInPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";

// Define the shape of our User profile
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

// Define the shape of our Mock stored users
interface StoredMockUser extends AuthUser {
  password?: string;
}

// Auth context state interface
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
  simulateEmailVerification: () => void; // only for mock auth testing
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase configuration keys are fully populated
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Read initial session from localStorage to prevent layout flashes
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      const activeSession = localStorage.getItem("lifevault_mock_session");
      if (activeSession) {
        try {
          return JSON.parse(activeSession);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(isFirebaseConfigured);
  const isMock = !isFirebaseConfigured;

  // Initialize Firebase app if keys are configured
  let auth: Auth | null = null;
  if (isFirebaseConfigured) {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
    } catch (e) {
      console.warn("Failed to initialize Firebase Auth. Falling back to Mock Auth.", e);
      auth = null;
    }
  }

  useEffect(() => {
    if (auth) {
      // Real Firebase observer
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            emailVerified: fbUser.emailVerified,
            photoURL: fbUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [auth]);

  // helper to save mock user session
  const saveMockSession = (mockUser: AuthUser) => {
    localStorage.setItem("lifevault_mock_session", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  // Sign In implementation
  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (auth) {
        const credential = await fbSignIn(auth, email, pass);
        const fbUser = credential.user;
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          emailVerified: fbUser.emailVerified,
          photoURL: fbUser.photoURL,
        });
      } else {
        // Mock login checks
        const storedUsersRaw = localStorage.getItem("lifevault_mock_users");
        const storedUsers: StoredMockUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        const matched = storedUsers.find((u) => u.email === email && u.password === pass);

        if (matched) {
          saveMockSession({
            uid: matched.uid,
            email: matched.email,
            displayName: matched.displayName,
            emailVerified: matched.emailVerified,
            photoURL: matched.photoURL,
          });
        } else if (email === "priya@example.com" && pass === "password123") {
          // default test account
          saveMockSession({
            uid: "mock-priya",
            email: "priya@example.com",
            displayName: "Priya Nair",
            emailVerified: true,
            photoURL: null,
          });
        } else {
          throw new Error("Invalid email or password. Use priya@example.com / password123 as test credentials.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Up implementation
  const signUp = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      if (auth) {
        const credential = await fbCreateUser(auth, email, pass);
        // Real auth needs confirmation to be emailed, we'll request verification
        await fbSendVerification(credential.user);
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: name,
          emailVerified: false,
          photoURL: null,
        });
      } else {
        // Mock register
        const storedUsersRaw = localStorage.getItem("lifevault_mock_users");
        const storedUsers: StoredMockUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        
        if (storedUsers.some((u) => u.email === email)) {
          throw new Error("An account with this email address already exists.");
        }

        const newMockUser: AuthUser = {
          uid: `mock-uid-${Date.now()}`,
          email,
          displayName: name,
          emailVerified: false,
          photoURL: null,
        };

        // save to register list
        storedUsers.push({ ...newMockUser, password: pass });
        localStorage.setItem("lifevault_mock_users", JSON.stringify(storedUsers));
        
        // set active session but unverified
        saveMockSession(newMockUser);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Out implementation
  const signOut = async () => {
    setLoading(true);
    try {
      if (auth) {
        await fbSignOut(auth);
      } else {
        localStorage.removeItem("lifevault_mock_session");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (auth) {
        const provider = new GoogleAuthProvider();
        const credential = await fbSignInPopup(auth, provider);
        const fbUser = credential.user;
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          emailVerified: fbUser.emailVerified,
          photoURL: fbUser.photoURL,
        });
      } else {
        // Mock Google signin
        const mockGoogleUser: AuthUser = {
          uid: `mock-google-${Date.now()}`,
          email: "google.user@example.com",
          displayName: "Google User",
          emailVerified: true,
          photoURL: null,
        };
        saveMockSession(mockGoogleUser);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset Password implementation
  const resetPassword = async (email: string) => {
    if (auth) {
      await fbResetPassword(auth, email);
    } else {
      // Mock alert
      console.log(`Mock reset password email requested for: ${email}`);
      const storedUsersRaw = localStorage.getItem("lifevault_mock_users");
      const storedUsers: StoredMockUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      if (email !== "priya@example.com" && !storedUsers.some((u) => u.email === email)) {
        throw new Error("No user record found for this email address.");
      }
    }
  };

  // Send Verification Email
  const sendVerificationEmail = async () => {
    if (auth && auth.currentUser) {
      await fbSendVerification(auth.currentUser);
    } else {
      console.log("Mock verification email sent to current session user.");
    }
  };

  // Simulate verification (useful for local mock dev)
  const simulateEmailVerification = () => {
    if (!auth && user) {
      const verified = { ...user, emailVerified: true };
      saveMockSession(verified);
    }
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
