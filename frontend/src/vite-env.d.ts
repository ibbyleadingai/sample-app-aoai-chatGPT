/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_AZURE_HISTORY_VISIBLE: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }