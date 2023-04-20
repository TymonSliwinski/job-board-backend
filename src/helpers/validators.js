export const validateMail = (email) => {
    if (!email) return false;
    const tester =
        /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return false;

    const account = emailParts[0];
    const address = emailParts[1];

    if (account.length > 64) return false;
    else if (address.length > 255) return false;

    const domainParts = address.split('.');
    if (
        domainParts.some((part) => {
            return part.length > 63;
        })
    )
        return false;

    if (!tester.test(email)) return false;
    return true;
};

export const validatePassword = (password) => {
    const tester =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) {
        return false;
    }
    if (!tester.test(password)) {
        return false;
    }
    return true;
};

const developerFields = ['firstName', 'lastName'];

const companyFields = ['name', 'avatar', 'location'];

export const validateFields = (obj) => {
    for (const field of obj.userType === 'developer'
        ? developerFields
        : companyFields) {
        if (!obj[field]) return false;
    }
    return true;
};

/**
 * Parses requirements property from offer data to string
 * @param {object} data - offer data
 * @returns offer data with requirements as JSON.stringify result
 */
export const parseOfferData = (data) => {
    data.requirements = JSON.stringify(data.requirements);
    return data;
};
