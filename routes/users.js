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

router.get( '/:user_id/:id/delete', (request, response) => {
  const {user_id, id} = request.params
  List.deleteItem(id)
  .then(response.redirect('/users/'+user_id))
})

router.get( '/:user_id/:id/:checked', (request, response) => {
  const {user_id, id, checked} = request.params
  // // console.log(request.params);
  // let checkedTrue=true;
  // let checkedFalse=false;
  // let isChecked;
  let isChecked;

  if(checked == "true"){
      isChecked=false
  } else {
      isChecked=true
  }
  console.log(isChecked);
  List.checkItem(isChecked, id)
  .then(response.redirect('/users/'+user_id))
})

router.post('/:id/add', (request, response) => {
  const {id}=request.params
  const {todo, description, length} = request.body
  let listorder = parseInt(length)+1
  List.addItem(id, todo, description, listorder)
    .then(response.redirect('/users/' + id))
})

router.get('/:id', (request, response) => {
  const {id}=request.params

  List.getItems(id)
    .then( items =>response.render( 'index', {items}))
})

module.exports = router;
