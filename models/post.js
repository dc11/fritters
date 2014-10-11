var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var Post = new Schema ({
	author 	: { type : ObjectId, ref : 'User' },
	post 	: String,
	time 	: { type : Date, default : Date.now }
})

module.exports = mongoose.model('Post', Post);