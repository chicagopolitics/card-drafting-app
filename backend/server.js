const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAIApi = require('openai');
const Card = require('./models/Card'); // Import the Card model
const DraftSession = require('./models/DraftSession'); // Import the DraftSession model
const { Server } = require('socket.io');

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080', // Allow requests from your Vue app
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:8080' // Allow requests from your Vue app
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/card-drafting-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up OpenAI API
const openai = new OpenAIApi({
    project: "proj_geIsAlGLYJ0Z0LuZLhh5SVrK",
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Helper function to parse card details from JSON object
function parseCardDetails(cards) {
    return cards.map(card => {
        console.log('Raw Card Object:', card);
        const parsedCard = {
            name: card['Name'] || '',
            cost: card['Cost'] || '',
            type: card['Type'] || '',
            powerToughness: card['Power/Toughness'] || '',
            ability: card['Ability'] || '',
            flavorText: card['FlavorText'] || '',
            artworkUrl: '', // Placeholder for artwork URL
        };
        console.log('Parsed Card Details:', parsedCard);
        return parsedCard;
    });
}

// Route to create a new draft session
app.post('/create-session', async (req, res) => {
  const { theme, players } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {"role":"user", "content":`Generate 5 unique Magic the Gathering cards based on the theme: ${theme}. Include the following attributes for each card: Name, Cost, Type, Power/Toughness, Ability, FlavorText.`},
        {"role":"system", "content":`Respond in a JSON format with a "cards" key containing an array of card objects, each having keys "Name", "Cost", "Type", "Power/Toughness", "Ability", and "FlavorText".`}
      ],
      max_tokens: 1000,
    });

    // Log the full response object
    console.log('Full response:', JSON.stringify(response, null, 2));

    // Extract the card data from the response
    const cardsJson = JSON.parse(response.choices[0].message.content);
    const generatedCards = parseCardDetails(cardsJson.cards);

    /*
    // Generate artwork for each card using DALL-E
    for (let card of generatedCards) {
      const artResponse = await openai.images.generate({
        model: "dall-e-2",
        prompt: `Artwork for a Magic the Gathering card with the following attributes: ${card.type}, ${card.ability}, ${card.flavorText}`,
        n: 1,
        size: '256x256',
      });
      console.log('Art Response:', artResponse);
      card.artworkUrl = artResponse.data[0].url;
    }
*/

    // Divide the cards into packs
    const packs = [];
    const packSize = 15;
    for (let i = 0; i < generatedCards.length; i += packSize) {
      packs.push(generatedCards.slice(i, i + packSize));
    }

    // Save the draft session to the database
    const draftSession = new DraftSession({
      theme,
      packs,
      players: players.map(name => ({ name })),
      currentPackIndex: 0,
      playerPicks: Array(players.length).fill([]),
      currentPlayerIndex: 0
    });

    await draftSession.save();

    io.emit('sessionUpdated', draftSession); // Emit event for session update

    res.json(draftSession);
  } catch (error) {
    console.error('Error creating draft session:', error.message);
    res.status(500).send(`Error creating draft session: ${error.message}`);
  }
});

// Route to join a draft session
app.post('/join-session', async (req, res) => {
  const { draftId, playerName } = req.body;

  try {
    const draftSession = await DraftSession.findById(draftId);

    if (!draftSession) {
      throw new Error('Draft session not found');
    }

    // Add player to session if not already added
    const playerExists = draftSession.players.some(player => player.name === playerName);

    if (!playerExists) {
      draftSession.players.push({ name: playerName });
      draftSession.playerPicks.push([]); // Initialize the player's picks array
    }

    await draftSession.save();

    io.emit('sessionUpdated', draftSession); // Emit event for session update

    res.json(draftSession);
  } catch (error) {
    console.error('Error joining draft session:', error.message);
    res.status(500).send(`Error joining draft session: ${error.message}`);
  }
});

// Route to pick a card
app.post('/pick-card', async (req, res) => {
  const { draftId, playerName, cardIndex } = req.body;

  try {
    const draftSession = await DraftSession.findById(draftId);

    if (!draftSession) {
      throw new Error('Draft session not found');
    }

    const currentPack = draftSession.packs[draftSession.currentPackIndex];

    if (!currentPack) {
      throw new Error('Current pack not found');
    }

    // Add picked card to player's collection
    const pickedCard = currentPack.splice(cardIndex, 1)[0];

    if (!pickedCard) {
      throw new Error('Picked card not found');
    }

    const playerIndex = draftSession.players.findIndex(player => player.name === playerName);

    if (playerIndex === -1) {
      throw new Error('Player not found in draft session');
    }

    if (!draftSession.playerPicks[playerIndex]) {
      draftSession.playerPicks[playerIndex] = []; // Initialize if undefined
    }

    draftSession.playerPicks[playerIndex].push(pickedCard);

    // Check if the pack is empty and move to the next pack
    if (currentPack.length === 0) {
      draftSession.currentPackIndex = (draftSession.currentPackIndex + 1) % draftSession.packs.length;
      draftSession.currentPlayerIndex = (draftSession.currentPlayerIndex + 1) % draftSession.players.length;
    } else {
      draftSession.currentPlayerIndex = (draftSession.currentPlayerIndex + 1) % draftSession.players.length;
    }

    await draftSession.save();

    io.emit('sessionUpdated', draftSession); // Emit event for session update

    res.json(draftSession);
  } catch (error) {
    console.error('Error picking card:', error.message);
    res.status(500).send(`Error picking card: ${error.message}`);
  }
});


// Add endpoint to fetch the draft session
app.get('/draft-session/:draftId', async (req, res) => {
  const { draftId } = req.params;

  try {
    const draftSession = await DraftSession.findById(draftId);
    res.json(draftSession);
  } catch (error) {
    console.error('Error fetching draft session:', error.message);
    res.status(500).send(`Error fetching draft session: ${error.message}`);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
