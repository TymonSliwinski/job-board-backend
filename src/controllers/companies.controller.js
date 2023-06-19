import { Prisma } from "@prisma/client";
import prisma from "../prismaClient.js";

export const getCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany({});
        return res.status(200).json(companies);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error', err });
    }
};

export const getCompany = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid company id' });
    }
    try {
        const company = await prisma.company.findFirst({
            where: {
                id
            }
        });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        return res.status(200).json(company);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error', err });
    }
};
