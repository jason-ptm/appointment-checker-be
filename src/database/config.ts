export const getDatabaseConfig = () => {
  console.log(process.env.DB_CONNECT_STRING);
  return {
    username: process.env.DB_USERNAME || 'defaultUser',
    password: process.env.DB_PASSWORD || 'defaultPassword',
    connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/orcl',
  };
};
