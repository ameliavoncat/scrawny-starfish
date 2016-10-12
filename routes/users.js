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

router.post('/:id/add', (request, response) => {
  const {id}=request.params
  const {todo, description, length} = request.body
  let listorder = length + 1
  List.addItem(id, todo, description, listorder)
    .then( results => response.redirect('/' + results.id))
})

router.get('/:id', (request, response) => {
  const {id}=request.params

  List.getItems(id)
    .then( items =>response.render( 'index', {items}))
})

module.exports = router;
