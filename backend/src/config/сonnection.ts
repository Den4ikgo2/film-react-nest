export const databaseConfig = {
  uri: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dataBase',
};

export const serverConfig = {
  port: process.env.PORT || 5432,
};
