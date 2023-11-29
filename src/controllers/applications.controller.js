import { Prisma } from '@prisma/client';
import prisma from '../prismaClient.js';

export const getApplications = async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id
        },
        select: {
            id: true,
            Company: {
                select: {
                    id: true
                }
            },
            Developer: {
                select: {
                    id: true
                }
            }
        }
    });

    let applications = [];
    try {
        if (user.Company[0]) {
            applications = await prisma.offer.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    companyId: user.Company[0].id,
                    Application: {
                        some: {}
                    }
                },
                select: {
                    id: true,
                    title: true,
                    Application: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        select: {
                            id: true,
                            status: true,
                            description: true,
                            createdAt: true,
                            developer: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    user: {
                                        select: {
                                            email: true
                                        }
                                    }
                                }
                            },
                        },
                    }
                }
            });
        }
        else if (user.Developer[0]) {
            applications = await prisma.application.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    developerId: user.Developer[0].id
                },
                select: {
                    id: true,
                    status: true,
                    description: true,
                    createdAt: true,
                    offer: {
                        select: {
                            id: true,
                            title: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return res.status(200).json(applications);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error while getting applications', err });
    }
}

export const addApplication = async (req, res) => {
    const { offerId, description } = req.body;
    if (!offerId || isNaN(parseInt(offerId)) || !description) {
        return res.status(400).json({ message: 'Missing data' });
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id
            },
            select: {
                Developer: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!user.Developer[0]) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const offer = await prisma.offer.findFirst({
            where: {
                id: offerId
            }
        });
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        const application = await prisma.application.upsert({
            where: {
                developerId_offerId: {
                    offerId,
                    developerId: user.Developer[0].id
                }
            },
            update: {
                status: 'pending',
                description
            },
            create: {
                status: 'pending',
                description,
                developerId: user.Developer[0].id,
                offerId
            }
        });
        return res.status(201).json(application);
    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ message: 'Invalid application data', err });
        }
        return res.status(500).json({ message: 'Error while adding application', err });
    }
}

export const resolveApplication = async (req, res) => {
    const { status } = req.body;
    const id = parseInt(req.params.id);

    if (!id || isNaN(id) || !status | status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({ message: 'Missing or invalid data' });
    }

    try {
        const company = await prisma.company.findFirst({
            where: {
                id: req.company.id
            }
        });
        if (!company) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const application = await prisma.application.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                status: true,
                offer: {
                    select: {
                        id: true,
                        companyId: true
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.offer.companyId !== company.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updatedApplication = await prisma.application.update({
            where: {
                id
            },
            data: {
                status
            }
        });

        return res.status(200).json({ status: updatedApplication.status });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError || err instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({ message: 'Invalid application data', err });
        }
        console.log(err)
        return res.status(500).json({ message: 'Error while updating application', err });
    }
}
