export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'expense_manager_expenses',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiration: process.env.JWT_EXPIRATION || '1d',
  },
});
