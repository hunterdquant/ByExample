var express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/success', function(req, res) {
    console.log('Sending user info:', req.user);
    res.send({state: 'success', user: req.user ? req.user : null});
  });

  router.get('/failure', function(req, res) {
    console.log('Failed to send user info:');
    res.send({state: 'failure', user: null, message: "Invallid username or password."});
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
  }));

  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
  }));

  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
