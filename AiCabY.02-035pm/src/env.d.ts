/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_CHAT: string;
  readonly VITE_ENABLE_QUICK_BOOKING: string;
  readonly VITE_ENABLE_VOICE: string;
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 