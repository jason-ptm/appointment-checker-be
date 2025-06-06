var express = require('express');
const { getUsers } = require('../src/useCases/getUser');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.send('respond with a resource');
  const result = await getUsers();
});

module.exports = router;
