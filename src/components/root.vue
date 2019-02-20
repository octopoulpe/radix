<template>
  <v-app>
    <player-infos></player-infos>
    <v-container grid-list-md>
      <v-layout row wrap>
        <badguy v-for="badguy in badguys" :id="badguy"></badguy>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row justify-center>
        <hand side="left"></hand>
        <hand side="right"></hand>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <artifact v-for="artifact in drawer" :id="artifact"></artifact>
      </v-layout>
    </v-container>
    <v-btn @click="hurt">HURT PLAYER</v-btn>
    <v-btn @click="spawn">SPAWN BADGUY</v-btn>
    <v-btn @click="card">SPAWN CARD</v-btn>
  </v-app>
</template>

<script>
const uuidv4 = require('uuid/v4');
module.exports = {
  components: {
    'player-infos': require('./player_infos.vue'),
    'badguy': require('./badguy.vue'),
    'hand': require('./hand.vue'),
    'artifact': require('./artifact.vue'),
  },
  methods: {
    hurt: function () {
      this.$store.commit('player/hurt');
    },
    spawn: function () {
      this.$store.commit('swarm/spawn', {
        collection: 'evils',
        id: uuidv4(),
        position: Math.floor(Math.random() * 1000),
        payload: {life: 100, resistance: 1, },
      });
    },
    card: function () {
      this.$store.dispatch('deck/spawn', {
        id: uuidv4(),
        artifact: {
          type: ['sword', 'dagger', 'bow', ][Math.floor(Math.random() * 3)],
          damages: 10,
          minDist: 5,
          cost: 10,
        },
      });
    },
  },
  computed: {
    badguys: function () {
      var badguys = this.$store.getters['swarm/closestThings'];
      return badguys.slice(0, this.$store.state.player.sight);
    },
    drawer: function () {
      return this.$store.state.deck.drawer;
    },
  },
};
</script>
