// Utility function to format the date to "day/month/year"
const formatDateToDMY = (date) => {
    if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

// Function to check if a date is in "dd/mm/yyyy" format
const isDDMMYYYY = (date) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return regex.test(date);
};

// Function to check if a date is in "dd-mm-yyyy" format
const isDDMMYYYYWithDash = (date) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    return regex.test(date);
};

// Function to check if a date is in "yyyy/mm/dd" format
const isYYYYMMDDWithSlash = (date) => {
    const regex = /^(\d{4})\/(\d{2})\/(\d{2})$/;
    return regex.test(date);
};

// Function to check if a date is in "yyyy-mm-dd" format
const isYYYYMMDD = (date) => {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    return regex.test(date);
};

module.exports = {
    formatDateToDMY,
    isDDMMYYYY,
    isDDMMYYYYWithDash,
    isYYYYMMDDWithSlash,
    isYYYYMMDD
};
