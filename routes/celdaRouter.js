import { Router } from "express";
import {getCelda, postCelda, putCelda, deleteCelda} from '../controllers/celdas.controller.js';

const celdaRouter = Router();


celdaRouter.get('/', getCelda); 
// celdaRouter.get('/', getCeldaById); 
// celdaRouter.get('/', getCeldasByEstado); 
celdaRouter.post('/', postCelda);
celdaRouter.put('/', putCelda); 
celdaRouter.delete('/', deleteCelda); 

export default celdaRouter;
