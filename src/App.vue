<template>
  <v-app>
    <div id="app">
      <JoinOrCreateDraftSession v-if="!sessionJoined" @session-created="handleSessionCreated" @session-joined="handleSessionJoined" />
      <DraftingInterface v-else :draftId="draftId" :playerName="playerName" />
    </div>
  </v-app>
</template>

<script>
import JoinOrCreateDraftSession from './components/JoinOrCreateDraftSession.vue';
import DraftingInterface from './components/DraftingInterface.vue';

export default {
  data() {
    return {
      sessionJoined: false,
      draftId: '',
      playerName: ''
    };
  },
  methods: {
    handleSessionCreated(draftId, playerName) {
      this.draftId = draftId;
      this.playerName = playerName;
      this.sessionJoined = true;
    },
    handleSessionJoined(draftId, playerName) {
      this.draftId = draftId;
      this.playerName = playerName;
      this.sessionJoined = true;
    }
  },
  components: {
    JoinOrCreateDraftSession,
    DraftingInterface
  }
};
</script>

<style>
@import 'vuetify/styles';
</style>
