import { Router } from 'express'
import * as CompaniesController from '../controllers/companies.controller.js';


const router = Router();

router.get('/', CompaniesController.getCompanies);

router.get('/:id', CompaniesController.getCompany);

export default router;
