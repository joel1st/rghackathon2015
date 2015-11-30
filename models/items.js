var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  id: Number,
  image: String,
  version: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('items', ItemSchema);