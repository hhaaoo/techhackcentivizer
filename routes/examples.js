var express = require('express');
var router = express.Router();

/* GET joystick example. */
router.get('/joystick', function(req, res, next) {
  res.render('joystick.html');
});

router.get('/wheel', function(req, res, next) {
  res.render('wheel.html');
});

router.get('/slider', function(req, res, next) {
  res.render('slider.html');
});

router.get('/mine', function(req, res, next) {
  res.render('index.html');
});

module.exports = router;
