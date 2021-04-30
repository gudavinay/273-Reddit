
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function getUserProfile() {
    return "To be impl...";
}

export function getToken() {
    return "To be impl...";
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
    var now = new Date();
    var diff = parseInt((now.getTime() - Date.parse(date)) / 1000);
    if (diff < 60) { return 'less than a minute ago'; }
    else if (diff < 120) { return 'about a minute ago'; }
    else if (diff < (2700)) { return (parseInt(diff / 60)).toString() + ' minutes ago'; }
    else if (diff < (5400)) { return 'about an hour ago'; }
    else if (diff < (86400)) { return 'about ' + (parseInt(diff / 3600)).toString() + ' hours ago'; }
    else if (diff < (172800)) { return '1 day ago'; }
    else { return (parseInt(diff / 86400)).toString() + ' days ago'; }
}