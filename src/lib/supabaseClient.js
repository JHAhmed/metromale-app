import { createClient } from '@supabase/supabase-js';
import { capacitorStorageAdapter } from '$lib/utils/capacitorStorageAdapter';


const supabaseUrl = 'https://pgyahfqymokiuahjrrmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneWFoZnF5bW9raXVhaGpycm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTUzOTAsImV4cCI6MjA3MzM5MTM5MH0.KKT5w1FSwo1KV90-0KAlgvRKwggTzAlOQmIDgJToS-U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: capacitorStorageAdapter,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false
	}
});
