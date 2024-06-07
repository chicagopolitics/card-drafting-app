const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAIApi = require('openai');
const Card = require('./models/Card'); // Import the Card model

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

// Route to generate cards
app.post('/generate-cards', async (req, res) => {
  const { theme } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {"role":"user", "content":`Generate 2 unique Magic the Gathering cards based on the theme: ${theme}. Include the following attributes for each card: Name, Cost, Type, Power/Toughness, Ability, FlavorText.`},
        {"role":"system", "content":`Respond in a JSON format with a "cards" key containing an array of card objects, each having keys "Name", "Cost", "Type", "Power/Toughness", "Ability", and "FlavorText".`}
      ],
      max_tokens: 1000,
    });

    // Log the full response object
    console.log('Full response:', JSON.stringify(response, null, 2));

    // Extract the card data from the response
    const cardsJson = JSON.parse(response.choices[0].message.content);
    const generatedCards = parseCardDetails(cardsJson.cards);

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

    // Save generated cards to the database
    const cards = await Card.insertMany(generatedCards);

    res.json(cards);
  } catch (error) {
    console.error('Error generating cards:', error.message);
    res.status(500).send(`Error generating cards: ${error.message}`);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
