<template>
  <div>
    <h1>Drafting Interface</h1>
    <div v-if="draftSession">
      <h2>Current Pack</h2>
      <div v-if="currentPack.length">
        <div v-for="(card, index) in currentPack" :key="index" class="card">
          <h3>{{ card.name }}</h3>
          <p>Cost: {{ card.cost }}</p>
          <p>Type: {{ card.type }}</p>
          <p>Power/Toughness: {{ card.powerToughness }}</p>
          <p>Ability: {{ card.ability }}</p>
          <p>Flavor Text: {{ card.flavorText }}</p>
          <img :src="card.artworkUrl" alt="Artwork" />
          <button @click="pickCard(index)" :disabled="isNotCurrentPlayer">Pick Card</button>
        </div>
      </div>
      <div v-else>
        <p>All cards have been picked from this pack.</p>
      </div>
    </div>
    <div v-else>
      <p>Draft session not found. Please start a draft session.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
      draftSession: null
    };
  },
  computed: {
    currentPack() {
      if (this.draftSession) {
        return this.draftSession.packs[this.draftSession.currentPackIndex];
      }
      return [];
    },
    isNotCurrentPlayer() {
      if (this.draftSession) {
        return this.draftSession.players[this.draftSession.currentPlayerIndex].name !== this.playerName;
      }
      return true;
    }
  },
  methods: {
    async fetchDraftSession() {
      try {
        const response = await axios.get(`http://localhost:5000/draft-session/${this.draftId}`);
        this.draftSession = response.data;
      } catch (error) {
        console.error('Error fetching draft session:', error);
      }
    },
    async pickCard(cardIndex) {
      try {
        const response = await axios.post('http://localhost:5000/pick-card', {
          draftId: this.draftId,
          playerName: this.playerName,
          cardIndex
        });
        this.draftSession = response.data;
      } catch (error) {
        console.error('Error picking card:', error);
      }
    }
  },
  mounted() {
    this.fetchDraftSession();
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
