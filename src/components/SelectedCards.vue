<template>
  <div>
    <h2>Selected Cards</h2>
    <div v-if="selectedCards.length">
      <div v-for="(card, index) in selectedCards" :key="index" class="card">
        <CardComponent :card="card" :disabled="true" />
      </div>
    </div>
    <div v-else>
      <p>No cards selected yet.</p>
    </div>
  </div>
</template>

<script>
import CardComponent from './CardComponent.vue';

export default {
  name: 'SelectedCards',
  props: {
    selectedCards: {
      type: Array,
      required: true
    }
  },
  components: {
    CardComponent
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
