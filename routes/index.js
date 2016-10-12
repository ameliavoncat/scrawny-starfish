var express = require('express');
var router = express.Router();
const {List} = require('../database/items.js')

router.get('/', function(request, response, next) {
  response.render( 'landing')
});

module.exports = router;
