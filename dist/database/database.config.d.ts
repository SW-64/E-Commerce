export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    logging: boolean;
}
export declare const dbConfig: () => {
    database: {
        host: string;
        port: string | number;
        database: string;
        username: string;
        password: string;
        logging: true;
    };
};
