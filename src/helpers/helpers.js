const fields = [
    'title',
    'description',
    'category',
    'location',
    'requirements',
    'salaryLower',
    'salaryUpper',
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
            equals: query.location.trim(),
            mode: 'insensitive'
        }
    }
    if (query.requirements) {
        where['requirements'] = {
            search: query.requirements.match(regex).join(' | ').replaceAll(':', '\\:'),
            mode: 'insensitive'
        }
    }
    // TODO - dorobic filtry do konca
    return where;
};

// /**
//  * 
//  * @param {Array<offer>} offers 
//  * @param {object} filters 
//  */
// export const filterOffers = async (offers, filters) => {
//     const {
//         title,
//         description,
//         category,
//         requirements,
//         location,
//         salaryLower,
//         salaryUpper
//     } = filters;
//     return offers.filter(offer => {
//         Object.keys(filters).reduce((isValid, filter) => {
//             if (!isValid) return false;

//         }, true);
//         let isValid = true;
//         if (title) {
//             isValid &&= offer.title.toLowerCase().includes(title.toLowerCase());
//         } else if (!isValid && description) {
//             isValid &&= offer.description.toLowerCase().includes(description.toLowerCase());
//         }
//         if (category) {
//             isValid &&= 
//         }
//         return isValid
//     });
// };
