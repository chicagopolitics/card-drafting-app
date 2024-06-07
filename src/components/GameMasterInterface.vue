<template>
    <div>
      <h1>Game Master Interface</h1>
      <input v-model="theme" placeholder="Enter theme" />
      <button @click="generateCards">Generate Cards</button>
  
      <div v-if="cards.length">
        <h2>Generated Cards</h2>
        <ul>
          <li v-for="card in cards" :key="card.name">
            <h3>{{ card.name }}</h3>
            <p>Cost: {{ card.cost }}</p>
            <p>Type: {{ card.type }}</p>
            <p>Power/Toughness: {{ card.powerToughness }}</p>
            <p>Ability: {{ card.ability }}</p>
            <p>Flavor Text: {{ card.flavorText }}</p>
            <img :src="card.artworkUrl" alt="Artwork" />
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        theme: '',
        cards: []
      }
    },
    methods: {
      async generateCards() {
        try {
          const response = await axios.post('http://localhost:5000/generate-cards', {
            theme: this.theme
          });
          this.cards = response.data;
        } catch (error) {
          console.error('Error generating cards:', error);
        }
      }
    }
  }
  </script>
  