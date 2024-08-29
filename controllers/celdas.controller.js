import Celda from '../models/celdas.js';

//get para recuperar una lista de todas las celdas
export async function getCelda(req, res) {
    try {
        const celdas = await Celda.find();
        res.json(celdas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las celdas', error });
    }
}

export async function getCeldasByEstado(req, res) {
    try {
        const celdas = await Celda.find({ estado: req.params.estado});
        res.json(celdas);
    }catch (error){
        res.status(500).json({msg: 'Error al obtener las celdas por estado', error});
    }
}

export async function getCeldasById(req, res) {
    try{
        const celda = await Celda.findById(req.params.id);
        if(!celda) {
            return res.status.(400).json({msg: 'Celda no encontrada'});
        }
        res.json(celda);
    }catch(error){
        res.status(500.json({msg: 'Error al obtener la celda', error}));
    }
    
}

//POST para crear una nueva celda
export async function postCelda(req, res) {
    let msg = 'Celda creada';
    const body = req.body;
    try {
        const nuevaCelda = new Celda(body);
        await nuevaCelda.save(); 
    } catch (error) {
        msg = error.message;
    }
    res.json({ msg: msg });
}

// Método PUT para actualizar una celda específica
export async function putCelda(req, res) {
    let msg = 'Celda actualizada';
    const { numberCelda, estado, plateVehicle, entry_date, departure_date, pin } = req.body;
    try {
        await Celda.findOneAndUpdate(
            { _id: req.params.id },
            { numberCelda, estado, plateVehicle, entry_date, departure_date, pin },
            { new: true }
        );
    } catch (error) {
        msg = error.message;
    }
    res.json({ msg: msg });
}

// Método DELETE para eliminar una celda específica
export async function deleteCelda(req, res) {
    let msg = 'Celda eliminada';
    try {
        await Celda.findByIdAndDelete(req.params.id);
    } catch (error) {
        msg = 'Hubo un problema al eliminar';
    }
    res.json({ msg: msg });
}
