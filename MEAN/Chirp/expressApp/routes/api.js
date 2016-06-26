var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

function isAuthenticated(req, res, next) {

  if (req.method === "GET") {
    return next();
  }
  if (!req.isAuthenticated()) {
    res.redirect('/#login');
  }
  return next();
}

router.use('/posts', isAuthenticated);

router.route('/posts')
            .get(function(req, res) {
              Post.find(function(err, posts) {
                if (err) {
                  return res.send(500, err);
                }
                return res.send(200, posts);
              });
            })
            .post(function(req, res) {
              var post = new Post();
              post.text = req.body.text;
              post.username = req.body.created_by;
              post.save(function(err, post) {
                if (err) {
                  return res.send(500, err);
                }
                console.log("returing " + post);
                return res.json(post);
              });
            });

router.route('/posts/:id')
            .get(function(req, res) {
              Post.findById(req.params.id, function(err, post) {
                if (err) {
                  res.send(err);
                }
                res.json(post);
              });
            })
            .put(function(req, res) {
              Post.findById(req.params.id, function(err, post) {
                if (err) {
                  res.send(err);
                }
                post.username = req.body.createdBy;
                post.text = req.body.text;
                post.save(function(err, post) {
                  if (err) {
                    res.send(err);
                  }
                  res.json(post);
                });
                res.json(post);
              });
            })
            .delete(function(req, res) {
              Post.remove({
                _id: req.params.id
              }, function(err) {
                if (err) {
                  res.send(err);
                }
                res.json('deleted :(')
              })
            });

module.exports = router;
