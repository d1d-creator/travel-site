const { getKnex } = require('../../api/_lib/db');
module.exports = async (req, res) => {
  const { id } = req.query;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const knex = getKnex();
  const row = await knex('destinations').where({ id }).first();
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
};
