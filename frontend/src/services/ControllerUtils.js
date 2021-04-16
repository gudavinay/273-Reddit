
const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export function getUserProfile(){
    return "To be impl...";
}

export function getToken(){
    return "To be impl...";
}

export function getMonthFromUtils(date){
    let localDate = new Date(new Date(date).setHours(new Date(date).getHours()-7))
    return months[localDate.getMonth()];
}

export function getDateFromUtils(date){
    let localDate = new Date(new Date(date).setHours(new Date(date).getHours()-7))
    return localDate.getDate();
}