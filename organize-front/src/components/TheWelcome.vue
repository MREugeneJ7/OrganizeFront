<template>
  <div class="slot" v-for="meet in meets" @click="getGnAndOpenModal(meet.id)">
    <h3 class="slot-desc">{{ meet.description }}</h3>
    <p>De {{ meet.availablePeriod.dateFrom }} a {{ meet.availablePeriod.dateTo }}</p>
    <button @click="deleteMeet(meet)">Eliminar</button>
  </div>
  <button @click="showCreateModal = true">Crear Quedada</button>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <Modal :show="showCreateModal" @close="showCreateModal = false">
      <template #header>
        <h3>Crear Quedada</h3>
      </template>
      <template #body>
        <label>Descripcion</label>
        <input v-model="gamenight.description" />
        <br />
        <label>Desde</label>
        <br />
        <input v-model="gamenight.availablePeriod.dateFrom" type="datetime" />
        <br />
        <label>hasta</label>
        <br />
        <input v-model="gamenight.availablePeriod.dateTo" type="datetime" />
      </template>
      <template #footer>
        <button @click="createGN()">Crear</button>
        <button @click="showCreateModal = false">Close</button>
      </template>
    </Modal>
  </Teleport>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <Modal :show="showViewModal" @close="showViewModal = false">
      <template #header>
        <h3>Quedada</h3>
      </template>
      <template #body>
        <h2>Descripcion</h2>
        <span>{{ gamenight.description }}</span>
        <br />
        <h2>Desde</h2>
        <br />
        <span>{{ gamenight.availablePeriod.dateFrom }}</span>
        <br />
        <h2>hasta</h2>
        <br />
        <span>{{ gamenight.availablePeriod.dateTo }}</span>
      </template>
      <template #footer>
        <button @click="">Añadir Fechas Por Usuario</button>
        <button @click="showViewModal = false">Close</button>
      </template>
    </Modal>
  </Teleport>
</template>

<script lang="ts">
import GameNight from '@/types/gamenight'
import DatePeriod from '@/types/dateperiod'
import { defineComponent } from 'vue'
import Modal from './Modal.vue'

export default defineComponent({
  components: {
    Modal
  },
  data() {
    return {
      meets: new Array<GameNight>(),
      showCreateModal: false,
      showViewModal: false,
      gamenight: new GameNight(new DatePeriod(new Date(), new Date()), '')
    }
  },
  methods: {
    async getMeets() {
      const res = await fetch('http://localhost:8090/gamenight', {
        //headers: {
        //  Authorization: "Bearer " + this.getToken(),
        //},
      })
      const finalRes = await res.json()
      this.meets = finalRes
    },
    async getGnAndOpenModal(meetId: string) {
      const res = await fetch('http://localhost:8090/gamenight/' + meetId, {
        //headers: {
        //  Authorization: "Bearer " + this.getToken(),
        //},
      })
      const finalRes = await res.json()
      this.gamenight = finalRes
      this.showViewModal = true
    },
    async createGN() {
      const res = await fetch('http://localhost:8090/gamenight', {
        headers: {
          'Content-Type': 'application/json'
          //Authorization: "Bearer " + this.getToken(),
        },
        method: 'POST',
        body: JSON.stringify(this.gamenight)
      })
      this.showCreateModal = false
      this.getMeets()
    },
    async deleteMeet(meet: GameNight) {
      const res = await fetch('http://localhost:8090/gamenight/' + meet.id, {
        headers: {
          'Content-Type': 'application/json'
          //Authorization: "Bearer " + this.getToken(),
        },
        method: 'DELETE'
      })
      this.getMeets()
    }
  },
  mounted() {
    this.getMeets()
    console.log(this.meets)
  }
})
</script>

<style>
.slot {
  background-color: rgba(82, 198, 233, 0.233);
  border-radius: 10px;
  padding: 1%;
  margin: 2%;
}

.slot-desc {
  font-weight: bold;
}
</style>
