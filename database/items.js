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

const checkItem = 'UPDATE list_items SET checked = $1 WHERE id = $2'

//TODO - Make list order function

List = {
  getItems: user_id => db.any(getAllListItems, [user_id]),
  addItem: (user_id, todo, description, list_order) => db.none(createListItem, [user_id, todo, description, list_order]),
  checkItem: ( checked_status, id ) => db.none(checkItem, [checked_status, id]),
  deleteItem: id => db.none(deleteListItem, [id]) 
}

module.exports = {List}
