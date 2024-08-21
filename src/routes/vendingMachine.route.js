import {Router} from 'express';
import {
    createVendingMachine,
    updateVendingMachine,
    getVendingMachinesByOwner,
    getVendingMachineDetails,
    addMaintenanceRecord,
    getMaintenanceRecords,
    deleteVendingMachine
} from '../controllers/vendingMachine.controller.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router();

router.post('/', verifyJWT, createVendingMachine);
router.patch('/:machineId', verifyJWT, updateVendingMachine);
router.get('/owner', verifyJWT, getVendingMachinesByOwner);
router.get('/:machineId', verifyJWT, getVendingMachineDetails);
router.get('/:machineId/maintenance', verifyJWT, getMaintenanceRecords);
router.post('/:machineId/maintenance', verifyJWT, addMaintenanceRecord);
router.delete('/:machineId', verifyJWT, deleteVendingMachine);

export default router;
