<template>
    <div>
      <h1>Join or Create Draft Session</h1>
      <input v-model="playerName" placeholder="Enter your name" />
      <div>
        <h2>Create New Session</h2>
        <input v-model="newTheme" placeholder="Enter theme for new session" />
        <button @click="createSession">Create Session</button>
      </div>
      <div>
        <h2>Join Existing Session</h2>
        <input v-model="draftId" placeholder="Enter draft session ID" />
        <button @click="joinSession">Join</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'JoinOrCreateDraftSession',
    data() {
      return {
        playerName: '',
        newTheme: '',
        draftId: ''
      };
    },
    methods: {
      async createSession() {
        try {
          const response = await axios.post('http://localhost:5000/create-session', {
            theme: this.newTheme,
            players: [this.playerName]
          });
          this.$emit('session-created', response.data._id, this.playerName);
        } catch (error) {
          console.error('Error creating draft session:', error);
        }
      },
      async joinSession() {
        try {
          await axios.post('http://localhost:5000/join-session', {
            draftId: this.draftId,
            playerName: this.playerName
          });
          this.$emit('session-joined', this.draftId, this.playerName);
        } catch (error) {
          console.error('Error joining draft session:', error);
        }
      }
    }
  };
  </script>
  