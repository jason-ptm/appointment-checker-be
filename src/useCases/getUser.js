export const getUsers = async () => {
  const connection = await getConnection();

  const query = 'SELECT * FROM users';

  try {
    const result = await connection.execute(query);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    try {
      await connection.close();
    } catch (closeError) {
      console.error('Error closing the connection:', closeError);
    }
  }
};
