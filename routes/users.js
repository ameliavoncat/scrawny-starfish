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
      response.redirect( '/users/' + result.id )
  })
})


router.post( '/signup', ( request, response, next ) => {
  const { email, password } = request.body

  List.checkEmail(email)
    .then( result => {
      if(result!==null){
        response.redirect('/')
      }
      else {
        User.createOne( email, password )
        .then(user => {
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
        }
      })
  }
)

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
    List.switchItemPriorities( list_order - 1, user_id, list_order)
      .then( response.redirect( '/users/' + user_id ) )
  } else {
    response.redirect( '/users/' + user_id)
  }
})

router.get( '/:user_id/:id/:list_order/down', (request, response) => {
    let { id, user_id, list_order} = request.params
  const { todo, description} = request.body

  list_order = parseInt( list_order )
  user_id = parseInt( user_id )

  return List.getListLength( user_id )
  .then( length => {
    if ( list_order < parseInt(length.count) ) {
    return List.switchItemPriorities( list_order + 1, user_id, list_order)
      .then( response.redirect( '/users/' + user_id) )
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

  return List.newItemPriority( parseInt(user_id) )
    .then( result => {
      if (result.max === null){
        List.addItem( user_id, todo, description, 1 )
      } else {
        let itemPriority = parseInt(result.max) + 1
        List.addItem( user_id, todo, description, itemPriority )
      }
    })
    .then( response.redirect( '/users/' + user_id ))
})


router.get( '/:id', ( request, response ) => {
  const { id } = request.params
  let sortedItems;
  if( request.user !== undefined && request.user.id == id ) {
    return List.getItems( id )
      .then( items => {
        sortedItems = items.sort( ( a, b ) => {
          return a.list_order - b.list_order
        })
        return sortedItems


      })  .then( sortedItems => response.render( 'index', { sortedItems: sortedItems, id } ) )

  } else {
      response.redirect( '/' )
  }

})

module.exports = router;
