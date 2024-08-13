import type DatePeriod from "./dateperiod"
import type User from "./user"

class PossiblePeriod{
    period!: DatePeriod
    users!: Array<User>
}

export default PossiblePeriod