var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    username: {type: String},
    chat: {type: String}
});

module.exports = mongoose.model('Chat', ChatSchema, 'chat_logs');