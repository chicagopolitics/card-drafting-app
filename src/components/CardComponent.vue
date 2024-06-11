<template>
    <v-card class="mx-auto my-4" max-width="400">
      <v-img :src="card.artworkUrl" aspect-ratio="1.7" alt="Artwork"></v-img>
      <v-card-title>{{ card.name }}</v-card-title>
      <v-card-subtitle>{{ card.type }}</v-card-subtitle>
      <v-card-text>
        <div>Cost: {{ card.cost }}</div>
        <div>Power/Toughness: {{ card.powerToughness }}</div>
        <div>Ability: {{ card.ability }}</div>
        <div>Flavor Text: {{ card.flavorText }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="pickCard" :disabled="disabled" color="primary">Pick Card</v-btn>
      </v-card-actions>
    </v-card>
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
  .v-card {
    margin: 10px;
  }
  </style>
  