const oracledb = require('oracledb');
const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

export const getConnection = async () => {
  try {
    const connection = await oracledb.getConnection(config);
    console.log('Database connection established successfully');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};
