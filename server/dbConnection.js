const mariadb = require('mariadb');

// Create a connection pool
const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  port: '3305',
  password: 'root',
  database: 'graphql_db',
});

// Function to execute queries
async function executeQuery(query, values = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(query, values);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  executeQuery,
};
