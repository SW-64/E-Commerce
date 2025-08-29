export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    logging: boolean;
}
export declare const dbConfig: () => {
    database: DatabaseConfig;
};
