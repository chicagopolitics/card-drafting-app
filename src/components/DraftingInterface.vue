<template>
  <div>
    <h1>Drafting Interface</h1>
    <div v-if="draftSession">
      <div>
        <p><strong>Session ID:</strong> {{ draftId }}</p>
        <p><strong>Player Name:</strong> {{ playerName }}</p>
        <p><strong>Participants:</strong> {{ participantNames.join(', ') }}</p>
        <p><strong>Current Turn:</strong> {{ currentPlayerName }}</p>
      </div>
      <h2>Current Pack</h2>
      <div v-if="isCurrentPlayer">
        <div v-if="currentPack.length">
          <CardComponent
            v-for="(card, index) in currentPack"
            :key="index"
            :card="card"
            :disabled="!isCurrentPlayer"
            :onPick="() => pickCard(index)"
          />
        </div>
        <div v-else>
          <p>All cards have been picked from this pack.</p>
        </div>
      </div>
      <div v-else>
        <p>Waiting for your turn...</p>
      </div>
      <SelectedCards :selectedCards="selectedCards" />
    </div>
    <div v-else>
      <p>Draft session not found. Please start a draft session.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { io } from 'socket.io-client';
import SelectedCards from './SelectedCards.vue';
import CardComponent from './CardComponent.vue';

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
      draftSession: null,
      socket: null
    };
  },
  computed: {
    currentPack() {
      if (this.draftSession) {
        return this.draftSession.packs[this.draftSession.currentPackIndex];
      }
      return [];
    },
    isCurrentPlayer() {
      if (this.draftSession) {
        return this.draftSession.players[this.draftSession.currentPlayerIndex].name === this.playerName;
      }
      return false;
    },
    selectedCards() {
      if (this.draftSession) {
        const playerIndex = this.draftSession.players.findIndex(player => player.name === this.playerName);
        return this.draftSession.playerPicks[playerIndex] || [];
      }
      return [];
    },
    participantNames() {
      if (this.draftSession) {
        return this.draftSession.players.map(player => player.name);
      }
      return [];
    },
    currentPlayerName() {
      if (this.draftSession) {
        return this.draftSession.players[this.draftSession.currentPlayerIndex].name;
      }
      return '';
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
    },
    initializeSocket() {
      this.socket = io('http://localhost:5000');
      this.socket.on('sessionUpdated', (updatedSession) => {
        if (updatedSession._id === this.draftId) {
          this.draftSession = updatedSession;
        }
      });
    }
  },
  mounted() {
    this.fetchDraftSession();
    this.initializeSocket();
  },
  components: {
    SelectedCards,
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
