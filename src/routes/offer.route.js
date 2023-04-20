import { Router } from 'express';
import passport from 'passport';
import { ensureCompany, verifyToken } from '../middlewares/verifyAuth.js';
import * as OfferController from '../controllers/offer.controller.js';

const router = Router();

router.get('/', OfferController.getOffers);

router.get('/:id', OfferController.getOffer);

router.post('/', verifyToken, OfferController.addOffer);

router.put('/:id', verifyToken, ensureCompany, OfferController.updateOffer);

export default router;
