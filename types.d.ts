declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      LOCAL_ADDRESS?: string;
    }
  }
}

export {};
