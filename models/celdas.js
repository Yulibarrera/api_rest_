import {model, Schema} from 'mongoose';

const celdaSchema = new Schema ({
    numberCelda:{
        type:Number,
        autoIncrement: true,
        unique: true,
    },
    estado:{
        type: String,
        enum: ['disponible', 'no disponible'], 
        default: 'disponible'
    },
    plateVehicle:{
        type:String,
        maxlength:[6, 'Max 6 characters'],
    },
    entry_date:{
        type: Date,

    }, 
    departure_date:{
        type: Date,
        default: Date.now,
    }, 
    pin:{
        type:String,
    }


})

export default model("Celda", celdaSchema, "celda") 