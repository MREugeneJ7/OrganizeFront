import type DatePeriod from "./dateperiod"

class GameNight{
    id?: string
    availablePeriod: DatePeriod
    description: string

    constructor(availablePeriod: DatePeriod, description: string){
        this.availablePeriod = availablePeriod
        this.description = description
    }
}

export default GameNight