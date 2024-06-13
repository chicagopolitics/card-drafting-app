<template>
  <v-card class="mx-auto my-4" max-width="400">
    <v-img :src="card.artworkUrl" aspect-ratio="1.7" alt="Artwork"></v-img>
    <v-card-title>{{ card.name }}</v-card-title>
    <v-card-subtitle>{{ card.type }}</v-card-subtitle>
    <v-card-text>
      <CardCost :cost="card.cost" />
      <div>Ability: {{ card.ability }}</div>
      <div><i>{{ card.flavorText }}</i></div>
      <div class="power-toughness">{{ card.powerToughness }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="pickCard" :disabled="disabled" color="primary">Pick Card</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CardCost from './CardCost.vue';

export default {
  name: 'CardComponent',
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
      if (typeof this.onPick === 'function') {
        this.onPick();
      }
    }
  },
  components: {
    CardCost
  }
};
</script>

<style scoped>
.v-card {
  margin: 10px;
  position: relative;
}
.power-toughness {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-weight: bold;
}
</style>
