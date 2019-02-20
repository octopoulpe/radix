<template>
  <div>
    position: {{position}}px
    player life: {{life}}pv
  </div>
</template>

<script>
module.exports = {
  computed: {
    life: function () {
      return this.$store.state.player.life;
    },
    position: function () {
      return this.$store.state.player.position;
    },
  },
};
</script>
