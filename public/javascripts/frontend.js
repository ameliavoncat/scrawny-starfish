const { List } = require('../database/items.js')

$(document).ready(function(){
  function checkedItem(id){
    $('.checkbox').change(function() {
      List.checkedItem(this.checked, id);
    })
})
