import { supabase } from '$lib/supabaseClient';

// Create reactive state using runes
export const auth = $state({
  loading: true,
  session: null,
  user: null
});

// Initialize auth state listener
let authSubscription = null;

// Function to initialize the auth listener
export function initAuth() {
  if (authSubscription) return; // Prevent multiple subscriptions

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    auth.loading = false;
    auth.session = session;
    auth.user = session ? session.user : null;
  });

  authSubscription = subscription;
}

// Function to cleanup the auth listener
export function cleanupAuth() {
  if (authSubscription) {
    authSubscription.unsubscribe();
    authSubscription = null;
  }
}

// Helper functions for authentication
export const authHandlers = {
  login: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  logout: async () => {
    return await supabase.auth.signOut();
  }
};