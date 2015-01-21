'use strict';

var express = require('express');
var controller = require('./generate.controller');

var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.delete('/:id', controller.destroy);
router.post('/daux', controller.dauxServer);

module.exports = router;
