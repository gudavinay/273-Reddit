
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function getUserProfile() {
    return "To be impl...";
}

export function getToken() {
    return "To be impl...";
}

export function getUserID() {
    return "6089d63ea112c02c1df2914c"; // to be impl
}

export function getMonthFromUtils(date) {
    let localDate = new Date(new Date(date).setHours(new Date(date).getHours() - 7))
    return months[localDate.getMonth()];
}

export function getDateFromUtils(date) {
    let localDate = new Date(new Date(date).setHours(new Date(date).getHours() - 7))
    return localDate.getDate();
}

export function getRelativeTime(date) {
    if (!date) {
        return null;
    }
    var now = new Date();
    var diff = parseInt((now.getTime() - Date.parse(date)) / 1000);
    if (diff < 60) { return 'a few seconds ago'; }
    else if (diff < 120) { return 'about a minute ago'; }
    else if (diff < (2700)) { return (parseInt(diff / 60)).toString() + ' minutes ago'; }
    else if (diff < (5400)) { return 'about an hour ago'; }
    else if (diff < (86400)) { return 'about ' + (parseInt(diff / 3600)).toString() + ' hours ago'; }
    else if (diff < (172800)) { return '1 day ago'; }
    else { return (parseInt(diff / 86400)).toString() + ' days ago'; }
}

export function nFormatter(num, digits) {
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
