import Celda from '../models/celdas.js';

export async function getCelda(req, res) {
    try {
        const celdas = await Celda.find().select('numberCelda estado');
        res.json(celdas);
    } catch (error) {
        res.status(500).json({ message: 'Error getting cells', error });
    }
};

export async function getCeldasByEstado(req, res) {
    try {
        const celdas = await Celda.find({ estado: req.params.estado});
        res.json(celdas);
    }
    catch (error){
        res.status(500).json({msg: 'Error getting cells by state', error});
    }
};

export async function getCeldasById(req, res) {
    try{
        const celda = await Celda.findById(req.params.id);
        if(!celda) return res.status(400).json({msg: 'Cell not found'});
        res.json(celda);
    }
    catch(error){
        res.status(500).json({msg: 'Error getting cell', error});
    }  
};

export async function postCelda(req, res) {
    try {
        const count = await Celda.countDocuments();
        if (count >= 10) {
            return res.status(400).json({ message: 'Cell limit reached.' });
        }
        const lastCelda = await Celda.findOne().sort({ numberCelda: -1 });
        const numeroCelda = lastCelda ? lastCelda.numberCelda + 1 : 1;

        const newCelda = new Celda({
            numberCelda: numeroCelda,
            estado: 'available',
            ...req.body 
        });

        await newCelda.save();
        res.json({ message: 'Created cell'});
    } 
    catch (error) {
        res.status(500).json({ message: 'Error creating cell', error });
    }
}

export async function putCelda(req, res) {
    try {
        const putCelda = await Celda.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!putCelda) return res.status(404).json({ message: 'Cell not found' });

        res.json({ message: 'Cell updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cell', error });
    }
}

export async function deleteCelda(req, res) {
    let msg = 'Deleted cell';
    try {
        await Celda.findByIdAndDelete(req.params.id);
    } catch (error) {
        msg = 'There was a problem deleting the cell';
    }
    res.json({ msg: msg });
};

export async function parkVehicle(req, res) {
    try {
        const celda = await Celda.findOne({ estado: 'available' }).sort({ numberCelda: 1 });
        if (!celda) return res.status(404).json({ message: 'No cells available' });

        const { plateVehicle } = req.body;
        if (!plateVehicle) return res.status(400).json({ message: 'Vehicle license plate is required' });

        celda.estado = 'not available';
        celda.plateVehicle = plateVehicle;
        celda.entry_date = new Date();
        celda.departure_date = null;
        celda.pin = null;

        await celda.save();
        res.json({ msg: 'Parked vehicle', celda });
    }
    catch (error) {
        res.status(500).json({ message: 'Error when parking vehicle', error: error.message });
    }
};


export async function goOutVehicle(req, res) {
    try {
        const celda = await Celda.findById(req.params.id);
        if (!celda) return res.status(404).json({ message: 'Cell not found' });
        if (celda.estado !== 'not available') return res.status(400).json({ message: 'The cell is not occupied' });

        const now = new Date();
        const horas = Math.max(1, Math.floor((now - celda.entry_date) / (1000 * 60 * 60)));
        const valor_a_pagar = horas * 5000;

        celda.estado = 'available';
        celda.plateVehicle = null;
        celda.departure_date = now;
        celda.pin = null;

        await celda.save();
        res.json({ message: 'The vehicle has left', valor_a_pagar });
    } catch (error) {
        res.status(500).json({ message: 'Error when registering vehicle exit', error });
    }
}

