import { Router } from "express";
import {getCelda, getCeldasByEstado, getCeldasById, postCelda, putCelda, deleteCelda, parkVehicle, goOutVehicle} from '../controllers/celdas.controller.js';

const celdaRouter = Router();


celdaRouter.get('/', getCelda); 
celdaRouter.get('/:id', getCeldasById); 
celdaRouter.get('/estado/:estado', getCeldasByEstado); 
celdaRouter.post('/', postCelda);
celdaRouter.put('/:id', putCelda); 
celdaRouter.delete('/:id', deleteCelda); 
celdaRouter.post('/parkVehicle', parkVehicle);
celdaRouter.post('/go_out/:id', goOutVehicle);

export default celdaRouter;
