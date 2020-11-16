require('dotenv').config();

// you need to add .env file for the environment variables

exports.rootPassword = process.env.ROOT_PASSWORD || 'default';
exports.username = process.env.DB_USERNAME || 'default';
exports.userPassword = process.env.DB_PASSWORD || 'default';
exports.databaseName = process.env.DATABASE_NAME || 'default';
