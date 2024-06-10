<template>
    <div class="card">
      <h3>{{ card.name }}</h3>
      <p>Cost: {{ card.cost }}</p>
      <p>Type: {{ card.type }}</p>
      <p>Power/Toughness: {{ card.powerToughness }}</p>
      <p>Ability: {{ card.ability }}</p>
      <p>Flavor Text: {{ card.flavorText }}</p>
      <img :src="card.artworkUrl" alt="Artwork" />
      <button @click="pickCard" :disabled="disabled">Pick Card</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      card: {
        type: Object,
        required: true
      },
      disabled: {
        type: Boolean,
        required: true
      },
      onPick: {
        type: Function,
        required: true
      }
    },
    methods: {
      pickCard() {
        this.onPick();
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
  