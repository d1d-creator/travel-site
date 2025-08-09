const { getKnex } = require('../_lib/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const knex = getKnex();
    await ensureUsersTable(knex);
    const existing = await knex('users').where({ email }).first();
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const ids = await knex('users').insert({ name, email, password_hash: hash }).returning('id');
    const id = Array.isArray(ids) ? ids[0] : ids;
    const user = await knex('users').where({ id }).first();
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'change-me');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

async function ensureUsersTable(knex){
  const exists = await knex.schema.hasTable('users');
  if (!exists) {
    await knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('email').unique();
      table.string('password_hash');
      table.timestamps(true, true);
    });
  }
}
