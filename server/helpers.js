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

exports.parseDateTime = (timeString) => {
    const stringList = timeString.split(' ');
    const dateList = stringList[0].split('/');
    const timeList = stringList[1].split(':');
    const newDateTime = new Date(dateList[2], dateList[1], dateList[0],
        timeList[0], timeList[1], timeList[2]);
    return newDateTime;
}