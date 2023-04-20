import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token===undefined) return res.status(401).send({ message: 'Unauthorized!' });

    let validatedToken = jwt.decode(token);
    if (validatedToken?.hasOwnProperty('sub') && validatedToken.type === 'accessToken') {
        req.user = {
            id: validatedToken.sub,
            email: validatedToken.email
        };
        next();
    } else {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

export const ensureCompany = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const company = await prisma.company.findFirst({
            where: {
                userId
            }
        });
        if (!company) {
            return res.status(403).json({ message: 'Forbidden - not authorized for this content' });
        }
        req.company = {
            id: company.id
        };
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', err });
    }
};
