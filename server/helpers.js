exports.getDateTime = () => {
    const currentdate = new Date();
    const day = '0' + currentdate.getDate()
    const month = '0' + (currentdate.getMonth() + 1)
    const year = currentdate.getFullYear();

    const hour = '0' + currentdate.getHours();
    const minute = '0' + currentdate.getMinutes();
    const second = '0' + currentdate.getSeconds();

    const datetime = day.slice(-2) + '/' + month.slice(-2) + '/' + year + ' ' + hour.slice(-2) + ':' + minute.slice(-2) + ':' + second.slice(-2);
    return datetime;
}