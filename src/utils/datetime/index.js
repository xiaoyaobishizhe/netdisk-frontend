function formatWithoutYear(date) {
    // eg: 2020-01-01 12:00:00 to 01-01 12:00
    return date.slice(5, 16);
}

export {
    formatWithoutYear
}