const knex = require('knex');

let instance;
function getKnex() {
  if (instance) return instance;
  const connection = process.env.DATABASE_URL || 'sqlite:./data/database.sqlite';
  instance = knex({
    client: connection.startsWith('postgres') || connection.startsWith('postgresql') ? 'pg' : 'sqlite3',
    connection,
    useNullAsDefault: true,
  });
  return instance;
}
module.exports = { getKnex };
