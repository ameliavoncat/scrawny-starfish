const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./database/users').User

const paramsOptions = {
  usernameField: 'email'
}

const findUser = (email, password) => {
  return User.find(email, password)
}

const findUserById = id => {
  return User.findById( id )
}

const strategy = new LocalStrategy( paramsOptions, (email, password, done ) => {
  findUser( email, password )
    .then( user => {
      console.log("email ", email, " password ", password)
      if( user === null ) {
        done( null, false, { message: 'Incorrect email or password.' })
      } else {
        console.log("You're a winner!")
        done( null, user )
      }
    })
    .catch( error => done( err ) )
})

passport.use( strategy )

passport.serializeUser( (user, done) => done( null, user.id ) )

passport.deserializeUser( (id, done) => {
  findUserById( id )
    .then( user => done( null, user ))
    .catch( error => done( error, null ))
})

module.exports = passport