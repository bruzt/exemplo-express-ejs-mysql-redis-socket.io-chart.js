var express = require('express');
var router = express.Router();
const mysql = require('../database/mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  mysql.query(`
  
    SELECT * FROM tb_users ORDER BY name;
    
    `, (err, result) => {

    if(err){

      res.status(500).json(err);

    } else {

      res.json(result);

    }
  });
});

module.exports = router;
