const databaseName = 'scrawny-starfish'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const getAllListItems = 'SELECT * FROM list_items WHERE user_id=$1'
const createListItem = `
  INSERT
  INTO list_items(user_id, todo, description, list_order)
  VALUES ($1, $2, $3, $4)
`
const deleteListItem = 'DELETE FROM list_items WHERE id = $1'


//TODO - Make list order function

List={
  getItems: () =>  db.any(getAllListItems, [1]),
}

module.exports = {List}