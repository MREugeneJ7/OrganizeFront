class GameNight{
    dateFrom: Date
    dateTo: Date
    description: string

    constructor(dateFrom: Date, dateTo: Date, description: string){
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}

export default GameNight