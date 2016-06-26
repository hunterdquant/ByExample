var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    console.log('Serializing:', user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializing:', id);
    User.findById(id, function(err, user) {
      if (err) {
        console.log('deserializing error');
        return done(err, false);
      }

      if (!user) {
        return done('user not found.', false);
      }
      return done(err, user);
    });
  });

  passport.use('login', new LocalStrategy ({
      passReqToCallback: true
    },
    function(req, username, password, done) {

      User.findOne({username: username}, function(err, user) {
        if (err) {
          return done(err, false);
        }

        if (!user) {
          return done('User ' + username + 'not found', false);
        }

        user.username = username;
        user.password = createHash(password);
        user.save(function(err, user) {
          if (err) {
            return done(err, false);
          }

          if (!isValidPassword(user, password)) {
            return done('Invalid password', false);
          }

          console.log('Successfully logged in user: ' + username);
          return done(null, user);
        });
      });
    }));

  passport.use('signup', new LocalStrategy ({
      passReqToCallback: true
    },
    function(req, username, password, done) {

      User.findOne({username: username}, function(err, user) {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done('Username is already taken.', false);
        }
        user = new User();
        user.username = username;
        user.password = createHash(password);
        user.save(function(err, user) {
          if (err) {
            return done(err, false);
          }
          console.log('Successfully signed up user: ' + username);
          return done(null, user);
        });
      });
    }));

  var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
  };

  var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};
