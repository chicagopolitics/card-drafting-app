const mongoose = require('mongoose');

const draftSessionSchema = new mongoose.Schema({
  theme: String,
  packs: [{ type: Array, default: [] }],
  currentPackIndex: { type: Number, default: 0 },
  playerPicks: [{ type: Array, default: [] }],
  players: [{ name: String }],
  currentPlayerIndex: { type: Number, default: 0 }
});

module.exports = mongoose.model('DraftSession', draftSessionSchema);
