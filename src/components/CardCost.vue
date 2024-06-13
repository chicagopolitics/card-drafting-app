<template>
  <div class="cost" v-html="costWithImages"></div>
</template>

<script>
import manaW from '../assets/W.svg';
import manaU from '../assets/U.svg';
import manaB from '../assets/B.svg';
import manaR from '../assets/R.svg';
import manaG from '../assets/G.svg';

export default {
  name: 'CardCost',
  props: {
    cost: {
      type: String,
      required: true
    }
  },
  computed: {
    costWithImages() {
      let cost = this.cost;
      const manaSymbols = {
        'W': manaW,
        'U': manaU,
        'B': manaB,
        'R': manaR,
        'G': manaG
      };

      // Replace each letter in cost with corresponding image
      for (const [symbol, image] of Object.entries(manaSymbols)) {
        const regex = new RegExp(symbol, 'g');
        const imgTag = `<img src="${image}" alt="${symbol}" style="width: 20px; height: 20px; vertical-align: middle;" />`;
        cost = cost.replace(regex, imgTag);
      }

      return cost;
    }
  }
};
</script>

<style scoped>
.cost {
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: bold;
}
</style>
