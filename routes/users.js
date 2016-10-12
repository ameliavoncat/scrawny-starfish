var express = require('express');
var router = express.Router();
const passport = require('../passport')
const { User } = require('../database/users.js')
const { List } = require('../database/items.js')

//TODO Make User Specific Routes for Each Todo
const authOptions = {
  successRedirect: '/',
  failureRedirect: '/users/login'
}

router.get('/login', (request, response) => {
  response.render('login')
});

router.post('/login', passport.authenticate( 'local'), function( request, response ) {
  const email = request.body.email

  User.findUserByEmail(email)
    .then( result => {
      console.log(result)
      response.redirect( '/users/' + result.id)
  })
  
})


router.get('/signup', (request, response) => {
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

router.get( '/logout', ( request, response ) => {
  request.logout()
  response.redirect( '/' )
})


router.get('/:id', (request, response) => {
  // List.getItems()
  //   .then( items => response.render( 'index', {list_items: items}))
  response.render('index')
})

module.exports = router;
