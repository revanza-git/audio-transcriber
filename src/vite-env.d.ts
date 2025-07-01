/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_MAX_FILE_SIZE_MB: string
  readonly VITE_DEV_PORT: string
  readonly VITE_DEV_HOST: string
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 