const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: String,
  cost: String,
  type: String,
  powerToughness: String,
  ability: String,
  flavorText: String,
  artworkUrl: String
});

module.exports = mongoose.model('Card', cardSchema);
