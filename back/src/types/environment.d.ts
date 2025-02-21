declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_HOST_DOCKER?: string;
      NODE_ENV: 'development' | 'production' | 'docker';
    }
  }
}

export {};