import {model, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const celdaSchema = new Schema ({
    numberCelda:{
        type:Number,
        unique: true,
        required: true,
    },
    estado:{
        type: String,
        enum: ['available', 'not available'], 
        default: 'available'
    },
    plateVehicle:{
        type:String,
        maxlength:[6, 'Max 6 characters'],
        default: null
    },
    entry_date:{
        type: Date,
        default: null
    }, 
    departure_date:{
        type: Date,
        default: null
    }, 
    pin:{
        type:String,
        default: null
    },
    valor_a_pagar: {
        type: Number,
        default: null
    }

})

celdaSchema.pre('save', function (next) {
    if (this.isModified('plateVehicle') && this.plateVehicle && this.numberCelda) {
        const pinString = `${this.numberCelda}${this.plateVehicle}`;
        this.pin = bcrypt.hashSync(pinString, 10);
    }
    next();
});

export default model("Celda", celdaSchema, "celda") 