
/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}

// Removed missing vite/client reference to resolve compilation error.
// The application relies on process.env.API_KEY as the exclusive source for API keys.

export {};
