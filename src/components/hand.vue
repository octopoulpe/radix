<template>
  <v-flex xs3>
    <v-card>
      <v-card-title>{{side}} hand</v-card-title>
      <v-card-text>
        <template v-if="artifact">
          {{artifact.type}}
        </template>
        <template v-else>
          EMPTY
        </template>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
module.exports = {
  props: ['side', ],
  computed: {
    artifact: function () {
      return this.$store.state.deck.artifacts[this.$store.state.player.hands[this.side]];
    }
  }
};
</script>
