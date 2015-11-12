var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var userSchema = new mongoose.Schema({
    username: {
    	type: String,
    	unique: true,
    	required: true
    },

    password: {
    	type: String,
    	required: true
    }
});

userSchema.methods.validPassword = function(enteredPassword, storedPassword) {
	return enteredPassword === storedPassword;
};

module.exports = mongoose.model('users', userSchema);
