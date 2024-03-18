<template>
  <div class="slot" v-for="meet in meets"> 
    <h3 class="slot-desc">{{ meet.description }}</h3>
    <p>
      De {{ meet.dateFrom }} a {{ meet.dateTo }}
    </p>
  </div>
</template>

<script lang="ts">
import GameNight from '@/types/gamenight';
import { defineComponent } from 'vue';



export default defineComponent({
  data() {
    return {
      meets : new Array<GameNight>()
    }
  },
  mounted() {
    this.meets.push(new GameNight(new Date(), new Date(), "Quedada juegos"))
    console.log(this.meets)
  }
})
</script>

<style>
.slot {
  background-color: rgba(82, 198, 233, 0.233);
  border-radius: 10px;
  padding: 1%;
}

.slot-desc {
  font-weight: bold;
}
</style>