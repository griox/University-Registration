export function validateEmailFormat(val) {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);
}

export function validatePasswordFormat(password) {
    if (password.length >= 8) {
        return true;
    } else {
        return false;
    }
}

export const encodePath = (email) => {
    if (email) return email.replace(/\./g, '%2E');
    else return 0;
};

export const decodePath = (email) => {
    if (email) return email.replace(/%2E/g, '.');
    else return 0;
};
