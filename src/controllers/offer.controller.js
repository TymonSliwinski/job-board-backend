import { Prisma } from '@prisma/client';
import prisma from '../prismaClient.js';
import { parseOfferData } from '../helpers/validators.js';
import { extractFilters, getOfferData } from '../helpers/helpers.js';


export const getOffers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const filters = extractFilters(req.query);
    try {
        const offers = await prisma.offer.findMany({
            take: size,
            skip: (page - 1) * size,
            where: filters
            // where: {
            //     requirements: {
            //         search: '\\:3',
            //         mode: 'insensitive'
            //     }
            // }
        })
        return res.status(200).json({ data: offers, meta: { page, size, filters } });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error while getting offers', err });
    }
};


export const getOffer = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid offer id' });
    }
    try {
        const offer = await prisma.offer.findFirst({
            where: {
                id
            }
        });
        if (!offer) {
            return res.status(404).json({ message: 'Error - offer not found' });
        }
        return res.status(200).json(offer);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error', err });
    }
};


export const addOffer = async (req, res) => {
    const data = parseOfferData(getOfferData(req.body));
    try {
        const company = await prisma.company.findFirst({
            where: {
                userId: req.user.id,
            },
        });
        const offer = await prisma.offer.create({
            data: {
                ...data,
                companyId: company.id,
            },
        });
        return res.status(201).setHeader('Location', `/offers/${offer.id}`).json(offer);
    } catch (err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ message: 'Invalid offer data', err });
        }
        return res.status(500).json({ message: 'Error while adding new offer', err });
    }
};


export const updateOffer = async (req, res) => {
    const offerId = parseInt(req.params.id);
    if (isNaN(offerId)) {
        return res.status(400).json({ message: 'Invalid offer id' })
    }
    const data = parseOfferData(getOfferData(req.body));
    try {
        const offer = await prisma.offer.update({
            where: {
                id: offerId,
            },
            data,
        });
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        if (offer.companyId !== req.company.id) {
            return res.status(403).json({ message: 'Forbidden - you do not have access to this resource' });
        }
        return res.status(200).json(offer);
    } catch (err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ message: 'Invalid offer data', err });
        }
        return res.status(500).json({ message: 'Error while updating offer', err });
    }
};

