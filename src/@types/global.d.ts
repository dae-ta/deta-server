declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_DATABASE: string;
    readonly SESSION_SECRET: string;
    readonly JWT_SECRET: string;
  }
}
