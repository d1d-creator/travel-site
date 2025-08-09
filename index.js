const { getKnex } = require('../../api/_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { q } = req.query || {};
  const knex = getKnex();
  await ensureDestTable(knex);
  let query = knex('destinations');
  if (q) query = query.where('name', 'ilike', `%${q}%`).orWhere('description', 'ilike', `%${q}%');
  const rows = await query.select();
  res.json(rows);
};

async function ensureDestTable(knex){
  const has = await knex.schema.hasTable('destinations');
  if (!has){
    await knex.schema.createTable('destinations', t=>{
      t.increments('id').primary(); t.string('name'); t.string('country'); t.text('description'); t.string('image'); t.integer('price');
    });
    await knex('destinations').insert([
      { name: 'Santorini Escape', country: 'Greece', description: 'A romantic getaway', image: 'https://source.unsplash.com/featured/?santorini', price: 1200 },
      { name: 'Tokyo Adventure', country: 'Japan', description: 'City lights & food', image: 'https://source.unsplash.com/featured/?tokyo', price: 1500 },
      { name: 'Safari Expedition', country: 'Kenya', description: 'Wildlife safari', image: 'https://source.unsplash.com/featured/?safari', price: 2300 },
      { name: 'Paris Art & Wine', country: 'France', description: 'Museums & cafes', image: 'https://source.unsplash.com/featured/?paris', price: 1800 },
      { name: 'Machu Picchu Trek', country: 'Peru', description: 'Inca Trail adventure', image: 'https://source.unsplash.com/featured/?machu+picchu', price: 2000 }
    ]);
  }
}
