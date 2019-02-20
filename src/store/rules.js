'use strict';

module.exports = {
  namespaced: true,
  state: {
    moveCost: 1,
  },
  getters: {
    evilEffect: function (state, getters, rootState) {
      return function (evil, artifact) {
        let playerBuffs = rootState.player.buffs;
        let artifactState = rootState.deck.artifacts[artifact];
        let evilState = rootState.swarm.evils[evil];

        let damagesGiven = artifactState.damages * playerBuffs.power;
        return {hurt: damagesGiven / evilState.resistance};
      };
    },
    playerEffect: function (state, getters, rootState) {
      return function (artifact) {
        let artifactState = rootState.deck.artifacts[artifact];
        return {heal: artifactState.heal};
      };
    },
    evilFeed: function (state, getters, rootState) {
      return function (evil, cyclesCount) {
        let playerPos = rootState.player.position;
        let evilState = rootState.swarm.evils[evil];

        let distance = Math.abs(evilState.position - playerPos);
        return cyclesCount / distance;
      };
    },
    evilAction: function () {
      return function (evil) {
        console.log('evilActions:', evil);
        return {};
      };
    },
    evilDrop: function (state, getters, rootState) {
      return function (evil) {
        // temporary
        let evilState = rootState.swarm.evils[evil];
        return {test: 'temporary nawak' + evilState.life, };
      };
    },
    playerApproachDest: function (state, getters, rootState) {
      return function (evil, artifact) {
        let evilPos = rootState.swarm.evils[evil].position;
        let minDist = rootState.deck.artifacts[artifact].minDist;
        let playerPos = rootState.player.position;
        let direction = -1;
        if (playerPos > evilPos) {
          direction = 1;
        }
        return evilPos + (direction * minDist);
      };
    },
    playerApproachCost: function (state, getters, rootState) {
      return function (to) {
        let playerPos = rootState.player.position;
        return Math.abs(playerPos - to) * state.moveCost;
      };
    },
    applyCost: function (state, getters, rootState) {
      return function (artifact) {
        let artifactState = rootState.deck.artifacts[artifact];
        return artifactState.cost;
      };
    },
  },
};
