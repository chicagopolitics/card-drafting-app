<template>
  <v-container>
    <h1>Deck Builder</h1>
    <div>
      <h2>Included Cards</h2>
      <v-row>
        <v-col
          v-for="(card, index) in includedCards"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <CardComponent
            :card="card"
            :onToggleInclude="() => toggleIncludeCard(index, true)"
          />
        </v-col>
      </v-row>
    </div>
    <div>
      <h2>Excluded Cards</h2>
      <v-row>
        <v-col
          v-for="(card, index) in excludedCards"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <CardComponent
            :card="card"
            :onToggleInclude="() => toggleIncludeCard(index, false)"
          />
        </v-col>
      </v-row>
    </div>
    <div>
      <h2>Add Land Cards</h2>
      <v-select
        v-model="selectedLand"
        :items="landOptions"
        label="Select Land Type"
        solo
      ></v-select>
      <v-text-field
        v-model.number="landCount"
        label="Number of Lands"
        type="number"
        solo
      ></v-text-field>
      <v-btn @click="addLandCard">Add Land Card</v-btn>
    </div>
    <v-btn @click="saveDeck">Save Deck</v-btn>
  </v-container>
</template>

<script>
import axios from 'axios';
import CardComponent from './CardComponent.vue';

export default {
  props: {
    draftId: {
      type: String,
      required: true
    },
    playerName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedCards: [],
      selectedLand: null,
      landCount: 1,
      landOptions: ["Mountain", "Plains", "Swamp", "Forest", "Island"]
    };
  },
  computed: {
    includedCards() {
      return this.selectedCards.filter(card => card.include);
    },
    excludedCards() {
      return this.selectedCards.filter(card => !card.include);
    }
  },
  methods: {
    async fetchSelectedCards() {
      try {
        const response = await axios.get(`http://localhost:5000/draft-session/${this.draftId}`);
        const playerIndex = response.data.players.findIndex(player => player.name === this.playerName);
        this.selectedCards = response.data.playerPicks[playerIndex].map(card => ({ ...card, include: true }));
      } catch (error) {
        console.error('Error fetching selected cards:', error);
      }
    },
    toggleIncludeCard(index, include) {
      if (include) {
        this.excludedCards[index].include = true;
      } else {
        this.includedCards[index].include = false;
      }
    },
    addLandCard() {
      for (let i = 0; i < this.landCount; i++) {
        this.selectedCards.push({
          name: this.selectedLand,
          type: 'Land',
          include: true
        });
      }
    },
    async saveDeck() {
      const includedCards = this.selectedCards.filter(card => card.include);
      try {
        await axios.post('http://localhost:5000/save-deck', {
          draftId: this.draftId,
          playerName: this.playerName,
          deck: includedCards
        });
        alert('Deck saved successfully!');
      } catch (error) {
        console.error('Error saving deck:', error);
      }
    }
  },
  mounted() {
    this.fetchSelectedCards();
  },
  components: {
    CardComponent
  }
};
</script>

<style scoped>
.v-card {
  margin: 10px;
}
</style>
