import { Resend } from 'resend';
import { env } from './env.config';

let resendClient: Resend | null = null;

export const initializeResend = (): Resend | null => {
  if (resendClient) return resendClient;

  if (!env.RESEND_API_KEY) {
    console.warn('[Resend Config] API Key pending. Resend Email configuration ready.');
    return null;
  }

  try {
    resendClient = new Resend(env.RESEND_API_KEY);
    console.log('[Resend Config] Resend Client initialized.');
    return resendClient;
  } catch (error) {
    console.warn('[Resend Config] Initialization error:', error instanceof Error ? error.message : error);
    return null;
  }
};
