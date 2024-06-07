const mongoose = require('mongoose');

const draftSessionSchema = new mongoose.Schema({
  theme: String,
  packs: Array,
  currentPackIndex: Number,
  playerPicks: Array
});

module.exports = mongoose.model('DraftSession', draftSessionSchema);
