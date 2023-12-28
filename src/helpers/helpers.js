const fields = [
    'title',
    'description',
    'category',
    'location',
    'requirements',
    'salaryLower',
    'salaryUpper',
    'latitude',
    'longitude',
];

const filters = [
    'text',
    'category',
    'location',
    'requirements',
    'salaryLower',
    'salaryUpper',
];

const regex = /\"[A-z0-9]+\"\:\d/gm;

export const getOfferData = (offer) => {
    return fields.reduce(
        (obj, key) => ((obj[key] = offer[key]), obj),
        {}
    );
};

export const extractFilters = (query) => {
    const where = {};
    // const filters = filters.reduce(
    //     (obj, key) => { if (query[key]) (obj[key] = query[key]); return obj },
    //     {}
    // );
    if (query.text) {
        where['OR'] = [
            {
                title: {
                    search: query.text.split(' ').join(' & '),
                    mode: 'insensitive'
                }
            },
            {
                description: {
                    search: query.text.split(' ').join(' & '),
                    mode: 'insensitive'
                }
            }
        ]
    }
    if (query.category) {
        where['category'] = {
            equals: query.category,
            // mode: 'insensitive'
        }
    }
    if (query.location) {
        where['location'] = {
            search: query.location.trim(),
            mode: 'insensitive'
        }
    }
    if (query.requirements) {
        where['requirements'] = {
            search: query.requirements.trim(),
            mode: 'insensitive'
        }
    }
    if (query.salaryLower) {
        where['salaryLower'] = {
            gte: parseInt(query.salaryLower)
        }
    }
    if (query.salaryUpper) {
        where['salaryUpper'] = {
            lte: parseInt(query.salaryUpper)
        }
    }
    return where;
};
