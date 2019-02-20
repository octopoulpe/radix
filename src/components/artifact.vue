<template>
  <v-flex transition="scale-transition" xs2>
    <v-card min-height="300px" @click="leftWield" @contextmenu.prevent="rightWield">
      <v-card-title>artifact</v-card-title>
      <v-card-text>
        uuid: {{info.id}},
        type: {{info.type}}
      </v-card-text>
      <v-card-actions>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
module.exports = {
  props: ['id', ],
  methods: {
    leftWield: function () {
      this.$store.dispatch('wield', {
        hand: 'left',
        artifact: this.id,
      });
    },
    rightWield: function () {
      this.$store.dispatch('wield', {
        hand: 'right',
        artifact: this.id,
      });
    },
  },
  computed: {
    info: function () {
      return this.$store.state.deck.artifacts[this.id];
    },
  },
};
</script>
