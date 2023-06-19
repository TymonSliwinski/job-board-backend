import bcrypt from 'bcrypt';
import prisma from '../prismaClient.js';
import { validateFields, validateMail, validatePassword } from '../helpers/validators.js';
import * as jwt from '../services/jwt.service.js';


export const login = async (req, res) => {
    const auth = async(password, user ) => {
        if(!await bcrypt.compare(password, user.password)) { 
            return res.status(401).send({ message: 'Wrong password' });
        }
        const tokens = jwt.createTokens(user);
        res.status(200).send({ message: 'Logged in', tokens,  userType: user.userType });
    }

    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send({ message: 'No username/email or password provided' })
    };

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }
    auth(password, user);
};

export const register = async (req, res) => {
    const { 
        email,
        password,
        userType
    } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    
    if (!validateMail(email))
        return res.status(400).json({ message: 'Inavalid email' });
    
    if (!validatePassword(password))
        return res.status(400).json({ message: 'Inavalid password' });
    
    if (!validateFields(req.body))
        return res.status(400).json({ message: 'Required fields not provided'});

    const userEmailCheck = await prisma.user.findFirst({ where: { email: email } });
    if (userEmailCheck)
        return res.status(400).json({ message: 'User already exists' });
    
    if (userType === 'company' && req.body.name) {
        const company = await prisma.company.findFirst({ where: { name: req.body.name } })
        if (company)
            return res.status(400).json({ message: 'Company already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                origin: 'local',
                userType
            }
        });
        if (!validateFields(req.body))
            throw new Error('Required fields not specified');
        let avatar = req.body.avatar;
        if (avatar && !avatar.includes('data:image/jpeg;base64,')) {
            avatar = 'data:image/jpeg;base64,' + avatar;
        }
        if (userType === 'developer') {
            const {
                firstName,
                lastName,
            } = req.body;
            await prisma.developer.create({
                data: {
                    firstName,
                    lastName,
                    avatar,
                    userId: user.id
                }
            });
        } else if (userType === 'company') {
            const {
                name,
                location
            } = req.body;

            await prisma.company.create({
                data: {
                    name,
                    avatar,
                    location,
                    userId: user.id
                }
            });
        } else {
            console.log('Invalid user Type:', userType);
            return res.status(400).json({ message: 'Invalid user type', userType });
        }
        return res.status(201).json({ message: 'User created' });
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', error });
    }
};


export const refreshToken = async (req, res) => {
    const headers = req.headers;
    if(typeof headers.authorization !== 'string' || req.headers === undefined) { 
        return res.status(400).send('Bad request');
    }

    const token = headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).send({ message: 'Missing token' });
    }
    const response = await jwt.refreshTokenService(token);
    if (response.hasOwnProperty('accessToken') && response.hasOwnProperty('refreshToken')) {
        res.status(200).send({ message: 'Token refreshed', tokens: response });
    } else {
        res.status(400).send({ message: 'Token expired or bad token provided' });
    }
};
