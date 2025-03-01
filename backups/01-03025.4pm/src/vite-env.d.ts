/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_OPENROUTER_URL: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_DEEPSEEK_URL: string
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
  readonly VITE_MAPBOX_STYLE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
