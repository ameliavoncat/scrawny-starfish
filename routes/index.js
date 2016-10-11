var express = require('express');
var router = express.Router();
const {List} = require('../database/items.js')

router.get('/', function(request, response, next) {
  List.getItems()
    .then( items => response.render( 'index', {list_items: items}))
});

module.exports = router;
