import express, { json } from 'express'
import dbConnection from '../database/config.js'
import '../database/config.js'
import celdaRouter from '../routes/celdaRouter.js'

class Server{
    constructor(){
    this.app = express()
    this.listen()
    this.dbConnection()
    this.pathCelda = "/api/parking"
    this.route()
    
    }

    route (){
        this.app.use(json())
        this.app.use(this.pathCelda, celdaRouter )
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running`)
        })
    }

    async dbConnection(){ 
        await dbConnection()
    }
}

export default Server