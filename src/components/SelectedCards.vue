<template>
    <div>
      <h2>Selected Cards</h2>
      <div v-if="selectedCards.length">
        <div v-for="(card, index) in selectedCards" :key="index" class="card">
          <h3>{{ card.name }}</h3>
          <p>Cost: {{ card.cost }}</p>
          <p>Type: {{ card.type }}</p>
          <p>Power/Toughness: {{ card.powerToughness }}</p>
          <p>Ability: {{ card.ability }}</p>
          <p>Flavor Text: {{ card.flavorText }}</p>
          <img :src="card.artworkUrl" alt="Artwork" />
        </div>
      </div>
      <div v-else>
        <p>No cards selected yet.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SelectedCards',
    props: {
      selectedCards: {
        type: Array,
        required: true
      }
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
  