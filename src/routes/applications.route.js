import { Router } from 'express';
import { ensureCompany, verifyToken } from '../middlewares/verifyAuth.js';
import * as ApplicationsController from '../controllers/applications.controller.js';

const router = Router();

router.get('/', verifyToken, ApplicationsController.getApplications);

router.post('/', verifyToken, ApplicationsController.addApplication);

router.post('/:id/status', verifyToken, ensureCompany, ApplicationsController.resolveApplication);

export default router;
