var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title:  String,
    author: String,
    summary: String,
    content: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
  });

blogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Blog', blogSchema, 'blogs');