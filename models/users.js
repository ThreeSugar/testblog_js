var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, index: true, unique: true, required: true, uniqueCaseInsensitive: true },
    password: { type: String, required: true }
});


UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema, 'users');

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(12, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback){
	module.exports.findById(id, callback);
}
