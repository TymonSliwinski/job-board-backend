import { Router } from 'express';
import { ensureCompany, verifyToken } from '../middlewares/verifyAuth.js';
import * as OffersController from '../controllers/offers.controller.js';

const router = Router();

router.get('/', OffersController.getOffers);

router.get('/:id', OffersController.getOffer);

router.post('/', verifyToken, OffersController.addOffer);

router.put('/:id', verifyToken, ensureCompany, OffersController.updateOffer);

export default router;
