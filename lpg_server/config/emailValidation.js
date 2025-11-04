// step-1: validate email format using regex
// step-2: check if email domain is in allowed list
// step-3: ping the email server to check if the email exists (optional, requires external service)
import dns from 'dns';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const checkEmailFormat = (email) => {
    if(!emailRegex.test(email)){
        return false;
    }
    return true;
}

export const checkEmailDomain = (email) => {
    const domain = email.split('@')[1];
    dns.resolveMx(domain, (err, adderesses) => {
        if(err || adderesses.length === 0) return false;
        return true;
    })
}

export const checkEmailExists = async (email) => {
    // This function would typically call an external service to verify email existence
    // For demonstration, we'll assume all emails that pass format and domain checks exist
    return true;
}