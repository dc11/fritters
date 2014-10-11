var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var userSchema = new Schema ({
	username	: { type : String, unique : true},
	password	: String,
	following	: [{ type : ObjectId, ref : 'User', unique : true }],
	posts		: [{ type : ObjectId, ref : 'Post' }]
});

userSchema.statics.findUserByUsername = function (username) {
	var user = this.where("username", username);
	return user._id;
}

var User = mongoose.model('User', userSchema);

module.exports = User;