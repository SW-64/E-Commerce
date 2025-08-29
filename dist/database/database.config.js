"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
const dbConfig = () => ({
    database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_DATABASE || "dbname",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD || "pw",
        logging: process.env.DB_LOGGING_ENABLED == "true" || false,
    },
});
exports.dbConfig = dbConfig;
//# sourceMappingURL=database.config.js.map