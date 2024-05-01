import type DatePeriod from "./dateperiod"
import type User from "./user"

class PeriodPerUser{
    user : User
    periods : Array<DatePeriod>


    constructor(periods : Array<DatePeriod>, user : User){
        this.periods = periods
        this.user = user
    }
}

export default PeriodPerUser