const databaseName = 'scrawny-starfish'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp( connectionString );

const bcrypt = require('bcrypt')
const saltRounds = 10

const User = {
  find: (email, password) => {
    return db.oneOrNone( 'SELECT * FROM users WHERE email=$1', [email] )
      .then( user => {
        return comparePassword( password, user )
    })
  },
  findById: id => db.one( 'SELECT * FROM users WHERE id=$1', [id] ),
  findUserByEmail: email => db.one( 'SELECT * FROM users WHERE email=$1', [email]),
  createOne: (email, password) => {
    return createSalt( password )
      .then( hashPassword )
      .then( hash => {
        return db.one(
          'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *',
          [email, hash]
        )
      })
  }
}


const createSalt = password => {
  return new Promise( (resolve, reject) => {
    bcrypt.genSalt( saltRounds, (error, salt) => {
      if( error ) {
        reject( error )
      }

      resolve([ salt, password ])
    })
  })
}

const hashPassword = saltResult => {
  const [ salt, password ] = saltResult

  return new Promise( (resolve, reject) => {
      bcrypt.hash( password, salt, (error, hash) => {
        if( error ) {
          reject( error )
        }

        resolve( hash )
      })
  })
}


const comparePassword = (password, user) => {
  return new Promise( (resolve, reject) => {
    bcrypt.compare( password, user.password, (err, result) => {
      const data = result ? user : null

      resolve( data )
    })
  })
}


module.exports={User}