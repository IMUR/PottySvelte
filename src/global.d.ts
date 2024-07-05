// global.d.ts
interface ImportMetaEnv {
  readonly VITE_GEOAPIFY_API_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
