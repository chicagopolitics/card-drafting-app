<template>
  <div id="app">
    <GameMasterInterface />
    <DraftingInterface />
  </div>
</template>

<script>
import GameMasterInterface from './components/GameMasterInterface.vue'
import DraftingInterface from './components/DraftingInterface.vue'

export default {
  components: {
    GameMasterInterface,
    DraftingInterface
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
