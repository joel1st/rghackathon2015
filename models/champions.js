var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChampionSchema = new Schema({
  name: String,
  id: Number,
  title: String,
  key: String,
  image: String,
  version: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('champions', ChampionSchema);