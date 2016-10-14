var express = require('express');
var router = express.Router();
const passport = require('../passport')
const { User } = require('../database/users.js')
const { List } = require('../database/items.js')

const authOptions = {
  successRedirect: '/',
  failureRedirect: '/users/login'
}


router.post( '/login', passport.authenticate( 'local' ), ( request, response ) => {
  const email = request.body.email

  User.findUserByEmail( email )
    .then( result => {
      console.log(result.id)
      console.log(request.user.id)
      response.redirect( '/users/' + result.id )
  })
})


router.post( '/signup', ( request, response, next ) => {
  const { email, password } = request.body

  User.createOne( email, password )
    .then( user => {
      request.login( { id: user.id, email }, error => {
        if( error ) {
          next( error )
        }
        response.redirect( '/users/' + user.id)
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
  let { user_id, id } = request.params
    user_id = parseInt( user_id )
    id = parseInt( id )

    List.adjustForDeletion( user_id, id )
      .then( List.deleteItem( id ))
        .then( response.redirect('/users/'+user_id) )
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
  console.log(user_id)
  List.newItemPriority(parseInt(user_id))
    .then( result => {
      console.log(result)
      if (result.max === null){
        List.addItem( user_id, todo, description, 1 )
      } else {
        let ItemPriority = parseInt(result.max) + 1
        List.addItem( user_id, todo, description, ItemPriority )
      }
    })
    .then( response.redirect( '/users/' + user_id ))
})


router.get( '/:id', ( request, response ) => {
  const { id } = request.params

  if( request.user !== undefined && request.user.id == id ) {
    return List.getItems( id )
      .then( items => {
        let sortedItems = items.sort( ( a, b ) => {
          return a.list_order - b.list_order
        })
        response.render( 'index', { items : sortedItems, id } )
      })
  }
  response.redirect( '/' )
})

module.exports = router;
