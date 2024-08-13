import type DatePeriod from "./dateperiod"
import type PeriodPerUser from "./periodperuser"

class GameNight{
    id?: string
    availablePeriod: DatePeriod
    description: string
    periodsPerUser!: Array<PeriodPerUser>

    constructor(availablePeriod: DatePeriod, description: string){
        this.availablePeriod = availablePeriod
        this.description = description
    }
}

export default GameNight