var express = require('express');
var router = express.Router();
const passport = require('../passport')
const {User} = require('../database/users.js')

//TODO Make User Specific Routes for Each Todo
const authOptions = {
  successRedirect: '/',
  failureRedirect: '/users/login'
}

router.get('/login', function(request, response) {
  response.render('login')
});

router.post('/login', passport.authenticate( 'local', authOptions ))


router.get('/signup', function(request, response) {
  response.render('signup');
});

router.post( '/signup', (request, response, next) => {
  const { email, password } = request.body

  User.createOne( email, password )
    .then( user => {
      request.login({ id: user.id, email }, error => {
        if( error ) {
          next( error )
        }

        response.redirect( '/' )
      })
    })
    .catch( error => {
      response.render( 'signup', { message: 'That email address is not available.' })
    })
})

module.exports = router;
