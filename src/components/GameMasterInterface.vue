<template>
    <div>
      <h1>Game Master Interface</h1>
      <input v-model="theme" placeholder="Enter theme" />
      <input v-model="players" placeholder="Enter player names (comma-separated)" />
      <button @click="initializeDraft">Initialize Draft</button>
  
      <div v-if="draftSession">
        <h2>Current Pack</h2>
        <div v-for="(card, index) in currentPack" :key="index">
          <h3>{{ card.name }}</h3>
          <p>Cost: {{ card.cost }}</p>
          <p>Type: {{ card.type }}</p>
          <p>Power/Toughness: {{ card.powerToughness }}</p>
          <p>Ability: {{ card.ability }}</p>
          <p>Flavor Text: {{ card.flavorText }}</p>
          <img :src="card.artworkUrl" alt="Artwork" />
          <button @click="pickCard(index)">Pick Card</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        theme: '',
        players: '',
        draftSession: null
      };
    },
    computed: {
      currentPack() {
        if (this.draftSession) {
          return this.draftSession.packs[this.draftSession.currentPackIndex];
        }
        return [];
      }
    },
    methods: {
      async initializeDraft() {
        try {
          const response = await axios.post('http://localhost:5000/generate-cards', {
            theme: this.theme,
            players: this.players.split(',').map(p => p.trim())
          });
          this.draftSession = response.data;
        } catch (error) {
          console.error('Error initializing draft:', error);
        }
      },
      async pickCard(cardIndex) {
        try {
          const response = await axios.post('http://localhost:5000/pick-card', {
            draftId: this.draftSession._id,
            playerIndex: this.draftSession.currentPlayerIndex,
            cardIndex
          });
          this.draftSession = response.data;
        } catch (error) {
          console.error('Error picking card:', error);
        }
      }
    }
  };
  </script>
  