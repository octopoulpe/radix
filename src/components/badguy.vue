<template>
  <v-flex transition="scale-transition" xs2>
    <v-card min-height="300px" @click="leftApply" @contextmenu.prevent="rightApply">
      <v-card-title>{{info.collection}}</v-card-title>
      <v-card-text>
        uuid: {{info.id}},
        position: {{info.position}},
        cycles: {{info.cycles}}
      </v-card-text>
      <v-card-actions>
        <v-btn @click="kill">kill badguy</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
module.exports = {
  props: ['id', ],
  methods: {
    kill: function () {
      this.$store.commit('swarm/kill', this.id);
    },
    leftApply: function () {
      this.$store.dispatch('apply', {
        hand: 'left',
        evil: this.id,
      });
    },
    rightApply: function () {
      this.$store.dispatch('apply', {
        hand: 'right',
        evil: this.id,
      });
    },
  },
  computed: {
    info: function () {
      console.log('bg:', this.id);
      let bg = this.$store.state.swarm.evils[this.id];

      return bg;
    },
  },
};
</script>
