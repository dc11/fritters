var express = require('express');
var async = require('async');
var User = require('../models/user');
var Post = require('../models/post');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

// Handles a client trying to create and account, renders the register page where he or she can register
router.get('/register', function (req, res) {
	res.render('register');
});


// handles a user signing in
router.post('/signin', function (req, res) {

	// get the username and password the client has passed into the form
	var username = req.body.username;
	var password = req.body.password;

	User.find({'username' : username, 'password' : password}, function (err, user) {
		var data = {};
		if (err) {
			data.failure = true;
			res.send(data);
		}
		else if (user.length > 0) {
			req.session.username = user[0].username;
			data.redirect = '/home/' + user[0].username;
			data.failure = false;
			res.send(data);
			// res.redirect('/home/' + user[0].username);
		}
		else {
			data.failure = true;
			res.send(data);
		}
	});
});

// handles a user registering for the website
router.post('/adduser', function (req, res) {

	// get the username and password from the passed in form
	var username = req.body.username;
	var password = req.body.password;

	User.find({"username" : username}, function (err, user) {
		var data = {};
		if (err) {
			data.failure = true;
			res.send(data);
		}
		else if (user.length > 0) {
			data.failure = false;
			data.usernameExists = true;
			res.send(data);
		}
		else {
			var newUser = new User({'username' : username, 'password' : password});
			newUser.save();
			req.session.username = username;
			data.failure = false;
			data.usernameExists = false;
			data.redirect = '/home/' + newUser.username;
			res.send(data);
		}
	});
});

router.get('/profile/:id', function (req, res) {
	var username = req.params.id;

	User.findOne({ "username" : username }).populate('following').populate('posts').exec( function (err, user) {
		var freets = [];
		if (err) {
			res.redirect('/home/' + username);
		}
		else if (req.session.username == user.username) {

			var count = 0;
			async.series([function (callback) {
				if (user.posts.length > 0) {
					user.posts.forEach( function (post, index) {
						Post.findOne({ "_id" : post }).populate('author').exec( function (postError, post) {
							if (postError) {
								callback(postError);
							}
							else {
								freets.push(post);
								if (user.posts.length == index + 1) {
									callback();
								}
							}
						});
					});
				}
				else {
					callback();
				}
			}, function (callback) {
				console.log("second function");
				if (user.following.length > 0) {
					user.following.forEach( function (followingUser, indexUser) {
						User.findOne({ "username" : followingUser.username }).populate('posts').exec( function (error, doc) {
							if (error) {
								callback(error);
							}
							else {
								if (doc.posts.length > 0) {
									doc.posts.forEach( function (post, indexPost) {
										Post.findOne({ "_id" : post }).populate('author').exec( function (postError, post) {
											if (postError) {
												callback(postError);
											}
											else {
												freets.push(post);
												if (user.following.length == indexUser + 1 && doc.posts.length == indexPost + 1) {
													callback();
												}
											}
										});
									});	
								}
								else if (doc.posts.length == 0 && user.following.length == indexUser + 1) {
									callback();
								}
							}
						});
					});
				}
				else {
					callback();
				}
			}, function (callback) {
				console.log(freets);
				res.render('profile', { user : user, posts : freets.reverse() });
			}]); 
		}
		else {
			res.redirect('/');
		}
	});
})


// Handles a user being directed to their home page
router.get('/home/:id', function (req,res) {

	// find the unique user whose page we are attempting to visit
	var username = req.params.id;

	var query = User.find({ "username" : username });

	query.exec( function (err, user){
		if (err) {
			res.redirect('/');
		}
		// if the user exists and his or her session matches the username of the age we are trying to vist
		else if (user[0].username == req.session.username) {

			// get all of the tweets in the db and render them on the user's homepage
			Post.find({}).populate('author').exec(function (error, freets) {
				console.log(freets);
				if (error) {
					console.log("I went here");
					res.redirect('/');
				}
				else {
					res.render('home', { user : user[0] , posts : freets.reverse(), following : user[0].following } );	
				}
			});
		}

		// if the user is not found in the db, redirect to the base route
		else {
			res.redirect('/');
		}
	});
});

// handles the creation of a tweet
router.post('/tweet/:id', function (req, res) {

	var freet = req.body.freet,
		username = req.params.id;

	User.findOne({ "username" : username }, function (err, user) {
		var data = {};
		if (err) {
			data.failure = true;
			res.send(data);
		}
		else {
			Post.create({ "author" : user._id , "post" : freet }, function (error, freet) {
				if (error) {
					data.failure = true;
				}
				else {
					user.posts.push(freet._id);
					user.save();
					data.failure = false;
					data.author = user.username;
					data.freet = freet.post;
					data.id = freet._id;
				}
				res.send(data);
			});					
		}
	});
});

// Handles the deletion of the tweet
router.post('/delete', function (req, res) {

	var data = {};
	// get the ID of the tweet
	var freetID = req.body.id;
	var author = req.body.author;
	
	// find the tweet matching the ID
	// upon finding the tweet in the db, remove it and redirect to the user's home route


	Post.find({ "_id" : freetID }).populate('author').exec( function (err, freet) {
		console.log(freet);
		var data = {};
		if (err) {
			data.failure = true;
			res.send(data);
		}
		else {
			User.findOne({ "username" : author }, function (error, user) {
				if (error) {
					data.failure = true;
					res.send(data);
				}
				else {
					var index = user.posts.indexOf(freetID);
					if (index !== -1) {
						user.posts.splice(index, 1);
						user.save();
					}
				}
			});
			Post.find( { "_id" : freetID} ).remove( function (error, tweet) {
				console.log("if this was successfully deleted number should be 1: " + tweet);
				if (error) {
					data.failure = true;
					res.send(data);
				}
				else {
					data.failure = false;
					res.send(data);
				}
			});
		}
	});
});

// Handles the editing of a tweet
router.post('/edit', function (req, res) {

	// find the ID of the tweet to be edited
	var tweetID = req.body.id;

	// get the author of the tweet
	var author = req.body.author;

	// get the content of the edited tweet
	var freet = req.body.freet;

	// find the tweet in the db and update its contents
	// reroute to the user's home page
	Post.find({ "_id" : tweetID }).update({ "post" : freet }, function (err, freetDoc) {
		var data = {};
		if (err) {
			data.failure = true;
		}
		else {
			data.failure = false;
			data.freet = freet;
		}
		res.send(data);
	});
});

router.post('/follow', function (req, res) {
	var user = req.body.user,
		toFollow = req.body.toFollow;

	User.findOne({ "username" : user }, function (err, user) {
		var data = {};
		if (err) {
			data.failure = true;
		}
		else {
			var index = user.following.indexOf(toFollow);
			if (index == -1) {
				user.following.push(toFollow);
				user.save();
			}
			data.failure = false;
		}
		res.send(data);
	});
});

router.post('/unfollow', function (req, res) {
	var user = req.body.user,
		toUnfollow = req.body.toUnfollow;

	User.findOne({ "username" : user }, function (err, user) {
		var data = {};
		if (err) {
			data.failure = true;
		}
		else {
			var index = user.following.indexOf(toUnfollow);
			if (index !== -1) {
				user.following.splice(index, 1);
				user.save();
			}
			data.failure = false;
		}
		res.send(data);
	});
});

router.post('/refreet', function (req, res) {
	var user = req.body.user,
		refreet = "RT -- " + req.body.refreet,
		postId = req.body.postId;

	console.log(user);

	User.findOne({ "username" : user }, function (err, user) {
		var data = {};
		if (err) {
			data.failure = true;
			res.send(data);
		}
		else {
			Post.create({ "author" : user._id, "post" : refreet}, function (error, freet) {
				if (error) {
					data.failure = true;
					res.send(data);
				}
				else {
					user.posts.push(freet._id);
					user.save();
					data.failure = false;
					data.refreet = refreet;
					data.author = user.username;
					data.id = freet._id;
					res.send(data);
				}
			});
		}
	});
});

// Handles logging out the user of Fritter
router.post('/logout', function (req, res) {

	// destroy the user's session and redirect them to the base route
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;













