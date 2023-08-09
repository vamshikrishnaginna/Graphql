const { executeQuery } = require('./dbConnection');

async function main() {
  try {
    const query = `INSERT INTO posts (title, content) VALUES ("title-5","content-5")`;
   const rows = await executeQuery(query);
   console.log(rows.insertId)
    console.log('Query result:', rows);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();