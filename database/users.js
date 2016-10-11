const databaseName = 'scrawny-starfish'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );



const User = {
  find: (email, password) => {
    return db.oneOrNone( 'SELECT * FROM users WHERE email=$1', [email] )
  },
  findById: id => db.one( 'SELECT * FROM users WHERE id=$1', [id] ),
  createOne: (email, password) => {
    // return createSalt( password )
    //   .then( hashPassword )
    //   .then( hash => {
        return db.one(
          'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *',
          [email, password]
        )
      // })
  }
}

module.exports={User}