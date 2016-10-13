var express = require('express');
var router = express.Router();
const passport = require('../passport')
const { User } = require('../database/users.js')
const { List } = require('../database/items.js')

const authOptions = {
  successRedirect: '/',
  failureRedirect: '/users/login'
}

router.get( '/login', ( request, response ) => {
  response.render( 'login' )
});

router.post( '/login', passport.authenticate( 'local' ), function( request, response ) {
  const email = request.body.email

  User.findUserByEmail( email )
    .then( result => {
      response.redirect( '/users/' + result.id )
  })
})


router.get( '/signup', ( request, response ) => {
  response.render( 'signup' );
});

router.post( '/signup', ( request, response, next ) => {
  const { email, password } = request.body

  User.createOne( email, password )
    .then( user => {
      request.login( { id: user.id, email }, error => {
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

router.get( '/:user_id/:id/delete', ( request, response ) => {
  const { user_id, id } = request.params
  List.deleteItem( id )
  .then(response.redirect('/users/'+user_id))
})

router.get( '/:user_id/:id/edit', ( request, response ) => {
  const { id } = request.params

  List.getOneItem(id)
    .then( result => response.render( 'edit', {result} ) )
})

router.post( '/:user_id/:id/edit', (request, response) => {
  const { id, user_id } = request.params
  const { todo, description, length} = request.body

  List.getOneItem(id)
    .then( result =>  List.editItem( todo, description, result.list_order, id ) )
    .then( result => response.redirect( '/users/' + user_id) )
})

router.get( '/:user_id/:id/:list_order/up', (request, response) => {
  let { id, user_id, list_order} = request.params
  const { todo, description} = request.body

    list_order = parseInt( list_order )
    user_id = parseInt( user_id )
  if( list_order > 1 ){
    List.moveItemPriority( list_order - 1, user_id, list_order)
      .then( List.moveItemPriority ( list_order, user_id, list_order - 1))
      .then( response.redirect( '/users/' + user_id) )
  } else {
    response.redirect( '/users/' + user_id)
  }
})

router.get( '/:user_id/:id/:list_order/down', (request, response) => {
    let { id, user_id, list_order} = request.params
  const { todo, description} = request.body

  list_order = parseInt( list_order )
  user_id = parseInt( user_id )

  List.getListLength( user_id )
  .then( length => {
    if ( list_order < parseInt(length.count) ) {
    List.moveItemPriority( list_order + 1, user_id, list_order)
      .then( List.moveItemPriority ( list_order, user_id, list_order + 1))
      .then( result => response.redirect( '/users/' + user_id) )
    } else {
      response.redirect( '/users/' + user_id)
    }
  })
})


router.get( '/:user_id/:id/:checked', ( request, response ) => {
  const { user_id, id, checked } = request.params
  let isChecked;
  (checked == "true") ? isChecked = false : isChecked = true

  List.checkItem( isChecked, id )
    .then( response.redirect( '/users/' + user_id ))
})

router.post( '/:user_id/add', ( request, response ) => {
  const { user_id } = request.params
  const { todo, description, length } = request.body

  List.newItemPriority(parseInt(user_id))
    .then( result => {
      let ItemPriority = parseInt(result.max) + 1
      List.addItem( user_id, todo, description, ItemPriority )
    })
    .then( response.redirect( '/users/' + user_id ))
})


router.get( '/:id', ( request, response ) => {
  const { id } = request.params

  List.getItems( id )
    .then( items => {
      // console.log(items)
      let sortedItems = items.sort( ( a, b ) => {
        return a.list_order - b.list_order
      })
      response.render( 'index', { items : sortedItems } )
    })
})

module.exports = router;
