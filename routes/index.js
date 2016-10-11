var express = require('express');
var router = express.Router();
const {List} = require('../database/db.js')

router.get('/', function(req, res, next) {
  List.getItems()
    .then( items => res.render( 'index', {list_items: items}))
});

module.exports = router;
