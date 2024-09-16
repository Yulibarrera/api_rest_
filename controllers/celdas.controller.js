import Celda from '../models/celdas.js';  // Importa el modelo 'Celda' de la base de datos para interactuar con las celdas de parqueadero.

// Obtener todas las celdas
export async function getCelda(req, res) {
    try {
        // Busca todas las celdas en la base de datos, seleccionando solo los campos 'numberCelda' y 'estado'.
        const celdas = await Celda.find().select('numberCelda estado');
        res.json(celdas);  // Devuelve las celdas en formato JSON.
    } catch (error) {
        // Si hay un error, responde con un mensaje de error y el error específico.
        res.status(500).json({ message: 'Error getting cells', error });
    }
};

// Obtener celdas por estado
export async function getCeldasByEstado(req, res) {
    try {
        // Busca celdas que coincidan con el estado pasado en los parámetros de la solicitud.
        const celdas = await Celda.find({ estado: req.params.estado });
        res.json(celdas);  // Devuelve las celdas filtradas en formato JSON.
    } catch (error) {
        // Si ocurre un error, responde con un mensaje de error.
        res.status(500).json({ msg: 'Error getting cells by state', error });
    }
};

// Obtener celda por ID
export async function getCeldasById(req, res) {
    try {
        // Busca una celda por el ID especificado en los parámetros de la solicitud.
        const celda = await Celda.findById(req.params.id);
        if (!celda) 
            return res.status(400).json({ msg: 'Cell not found' });  // Si no se encuentra la celda, responde con un mensaje de error.
        res.json(celda);  // Si se encuentra la celda, la devuelve en formato JSON.
    } catch (error) {
        // Si hay un error, responde con un mensaje de error.
        res.status(500).json({ msg: 'Error getting cell', error });
    }
};

// Crear una nueva celda
export async function postCelda(req, res) {
    try {
        // Cuenta cuántas celdas existen en la base de datos.
        const count = await Celda.countDocuments();
        // Si ya hay 10 celdas, no permite crear más y devuelve un error.
        if (count >= 10) {
            return res.status(400).json({ message: 'Cell limit reached.' });
        }
        
        // Obtiene la última celda registrada, ordenando por 'numberCelda' en orden descendente.
        const lastCelda = await Celda.findOne().sort({ numberCelda: -1 });
        // Si existe una celda, incrementa su número. Si no, comienza en 1.
        const numeroCelda = lastCelda ? lastCelda.numberCelda + 1 : 1;

        // Crea una nueva celda con el número generado y estado 'available' por defecto.
        const newCelda = new Celda({
            numberCelda: numeroCelda,
            estado: 'available',
            ...req.body  // Copia los demás campos del cuerpo de la solicitud.
        });

        await newCelda.save();  // Guarda la nueva celda en la base de datos.
        res.json({ message: 'Created cell', newCelda });  // Responde con un mensaje de éxito y la nueva celda creada.
    } catch (error) {
        // Si ocurre un error al crear la celda, responde con un mensaje de error.
        res.status(500).json({ message: 'Error creating cell', error });
    }
}

// Actualizar una celda
export async function putCelda(req, res) {
    try {
        // Actualiza la celda por su ID con los datos proporcionados en el cuerpo de la solicitud.
        const putCelda = await Celda.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!putCelda) 
            return res.status(404).json({ message: 'Cell not found' });  // Si no se encuentra la celda, responde con un mensaje de error.

        // Responde con un mensaje de éxito y la celda actualizada.
        res.json({ message: 'Cell updated successfully', putCelda });
    } catch (error) {
        // Si ocurre un error al actualizar la celda, responde con un mensaje de error.
        res.status(500).json({ message: 'Error updating cell', error });
    }
}

// Eliminar una celda
export async function deleteCelda(req, res) {
    let msg = 'Deleted cell';  // Mensaje por defecto en caso de éxito.
    try {
        // Elimina la celda por su ID.
        await Celda.findByIdAndDelete(req.params.id);
    } catch (error) {
        // Si ocurre un error, cambia el mensaje a un mensaje de error.
        msg = 'There was a problem deleting the cell';
    }
    // Devuelve un mensaje indicando si se eliminó o si hubo un problema.
    res.json({ msg: msg });
};

// Parquear un vehículo en una celda disponible
export async function parkVehicle(req, res) {
    try {
        // Busca una celda disponible (estado 'available') y la ordena por número de celda en orden ascendente.
        const celda = await Celda.findOne({ estado: 'available' }).sort({ numberCelda: 1 });
        if (!celda) 
            return res.status(404).json({ message: 'No cells available' });  // Si no hay celdas disponibles, responde con un error.

        const { plateVehicle } = req.body;  // Obtiene el número de placa del vehículo desde el cuerpo de la solicitud.
        if (!plateVehicle) 
            return res.status(400).json({ message: 'Vehicle license plate is required' });  // Si no se proporciona la placa, responde con un error.

        // Actualiza los datos de la celda con el vehículo parqueado.
        celda.estado = 'not available';
        celda.plateVehicle = plateVehicle;
        celda.entry_date = new Date();  // Registra la fecha de entrada del vehículo.
        celda.departure_date = null;  // La fecha de salida es nula hasta que el vehículo salga.
        celda.pin = null;  // Se puede agregar un PIN opcional (actualmente nulo).

        await celda.save();  // Guarda los cambios en la base de datos.
        res.json({ msg: 'Parked vehicle', celda });  // Responde con un mensaje de éxito y la celda actualizada.
    } catch (error) {
        // Si ocurre un error al parquear el vehículo, responde con un mensaje de error.
        res.status(500).json({ message: 'Error when parking vehicle', error: error.message });
    }
};

// Registrar la salida de un vehículo
export async function goOutVehicle(req, res) {
    try {
        // Busca la celda por su ID.
        const celda = await Celda.findById(req.params.id);
        if (!celda) 
            return res.status(404).json({ message: 'Cell not found' });  // Si no se encuentra la celda, responde con un error.
        if (celda.estado !== 'not available') 
            return res.status(400).json({ message: 'The cell is not occupied' });  // Si la celda no está ocupada, devuelve un error.

        const now = new Date();  // Registra la fecha actual.
        // Calcula el número de horas que el vehículo estuvo parqueado, mínimo 1 hora.
        const horas = Math.max(1, Math.floor((now - celda.entry_date) / (1000 * 60 * 60)));
        // Calcula el valor a pagar (5,000 por hora).
        const valor_a_pagar = horas * 5000;

        // Restablece los valores de la celda a disponible y limpia los datos del vehículo.
        celda.estado = 'available';
        celda.plateVehicle = null;
        celda.departure_date = now;  // Registra la fecha de salida.
        celda.pin = null;

        await celda.save();  // Guarda los cambios en la base de datos.
        res.json({ message: 'The vehicle has left', valor_a_pagar });  // Responde con un mensaje de éxito y el valor a pagar.
    } catch (error) {
        // Si ocurre un error al registrar la salida, responde con un mensaje de error.
        res.status(500).json({ message: 'Error when registering vehicle exit', error });
    }
}
