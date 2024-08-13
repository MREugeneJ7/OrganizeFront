<template>
  <div class="slot" v-for="meet in meets">
    <div @click="getGnAndOpenModal(meet.id!)">
      <h3 class="slot-desc">{{ meet.description }}</h3>
      <p>De {{ meet.availablePeriod.dateFrom }} a {{ meet.availablePeriod.dateTo }}</p>
    </div>
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
        <h2>Fechas disponibles</h2>
        <div v-for="period in possiblePeriods">
          <p>De {{ period.period.dateFrom }} a {{ period.period.dateTo }}</p>
          <p>Pueden: </p>
          <ul>
            <li v-for="user in period.users">
              {{ user.username }}
            </li>
          </ul>
          <button v-if="period.users.length == 1 && period.users[0].username == getUsername()" @click="deletePeriod(period.period)">Eliminar</button>
        </div>
        <div v-if="showUserDates">
          <h2>Tus Fechas</h2>
          <div v-for="period in userPeriods.periods">
            <p>De {{ period.dateFrom }} a {{ period.dateTo }}</p>
            <button @click="deletePeriod(period)">Eliminar</button>
          </div>
          <input v-model="newPeriod.dateFrom" type="datetime-local" />
          <input v-model="newPeriod.dateTo" type="datetime-local" />
          <button @click="addPeriod()">Añadir periodo</button>
          <button @click="updateDatePeriods()">Enviar</button>
        </div>
      </template>
      <template #footer>
        <button @click="openUserDates(gamenight)">Añadir Fechas Por Usuario</button>
        <button @click="showViewModal = false">Close</button>
      </template>
    </Modal>
  </Teleport>
</template>

<script lang="ts">
import GameNight from '@/types/gamenight'
import DatePeriod from '@/types/dateperiod'
import PeriodPerUser from '@/types/periodperuser'
import PossiblePeriod from '@/types/PossiblePeriod'
import { defineComponent } from 'vue'
import Modal from './Modal.vue'
import User from '@/types/user'
import KeyCloakService from '@/config/keycloak-plugin'

export default defineComponent({
  components: {
    Modal
  },
  data() {
    return {
      meets: new Array<GameNight>(),
      showCreateModal: false,
      showViewModal: false,
      showUserDates: false,
      gamenight: new GameNight(new DatePeriod(new Date(), new Date()), ''),
      userPeriods: new PeriodPerUser(new Array<DatePeriod>(), new User('', '')),
      newPeriod: new DatePeriod(new Date(), new Date()),
      possiblePeriods: new Array<PossiblePeriod>()
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

      console.log(this.gamenight)

      const resP = await fetch('http://localhost:8090/gamenight/' + meetId + '/possiblePeriods', {
        //headers: {
        //  Authorization: "Bearer " + this.getToken(),
        //},
      })
      const finalResP = await resP.json()
      this.possiblePeriods = finalResP

      console.log(this.possiblePeriods)

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
    },
    async updateDatePeriods() {
      const res = await fetch(
        'http://localhost:8090/gamenight/' +
          this.gamenight.id +
          '/user/' +
          this.userPeriods.user.id +
          '/username/' +
          this.userPeriods.user.username +
          '/periods',
        {
          headers: {
            'Content-Type': 'application/json'
            //Authorization: "Bearer " + this.getToken(),
          },
          method: 'PATCH',
          body: JSON.stringify(this.userPeriods.periods, this.replacer)
        }
      )
      const finalRes = await res.json()
      this.gamenight = finalRes
      this.getMeets()
    },
    deletePeriod(period: DatePeriod) {
      this.userPeriods.periods = this.userPeriods.periods.filter(
        (uP) => uP.dateFrom != period.dateFrom || uP.dateTo != period.dateTo
      )
    },
    addPeriod() {
      this.userPeriods.periods.push(this.newPeriod)
      this.newPeriod = new DatePeriod(new Date(), new Date())
    },
    getToken(): string | undefined {
      return KeyCloakService.GetAccesToken()
    },
    getId(): string {
      let id = KeyCloakService.GetId()
      return id != undefined ? id : ''
    },
    getUsername(): string {
      let username = KeyCloakService.GetUserName()
      return username != undefined ? username : ''
    },
    openUserDates(meet: GameNight) {
      this.showUserDates = true
      if (!meet.periodsPerUser)
        this.userPeriods =new PeriodPerUser(new Array<DatePeriod>(), new User(this.getId(), this.getUsername()))
      else{
        this.userPeriods = meet.periodsPerUser.filter((ppu) => ppu.user.id == this.getId())[0]
        if(!this.userPeriods)
        this.userPeriods =new PeriodPerUser(new Array<DatePeriod>(), new User(this.getId(), this.getUsername()))
      }
    },
    replacer(key : any, value: any) {

      if(/date.*/.test(key)){
        return new Date(value).toISOString()
      }

      return value;
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
