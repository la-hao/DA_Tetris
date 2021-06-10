const rankModel = require('../models/rank-board.model');
const NUMBER_TOP = process.env.NUMBER_TOP || 10;

//Lay dsach Top BXH
exports.getTopRankBoard = async () => {
    const data = await rankModel.find({});
    const sortData = data.slice().sort(function (a, b) { return (b.score - a.score) });
    let list = [];
    data.map(member => {
        const item = {
            username: member.username,
            score: member.score,
            rank: sortData.indexOf(member) + 1
        };
        list.push(item);
    })
    //console.log('list:', list);
    return await list.sort(function (a, b) { return (a.rank - b.rank) });
};

//Kiem tra co the cap nhat BXH hay ko
exports.abledToUpdateRank = async (score) => {
    const data = await rankModel.find({});//lay dsach bang xep hang
    if (data.length < NUMBER_TOP) {
        return true;
    }
    const list = await this.getTopRankBoard();
    return (score > list[list.length - 1].score);
}

//Cap nhat lai BXH
exports.updateRankBoard = async (user) => {
    try {
        const data = await rankModel.find({});//lay dsach bang xep hang
        // const sortData = await data.slice().sort((a, b) => a.score - b.score);
        //Kiem tra nguoi choi co ton tai tren BXH chua
        const mem = await rankModel.findOne({ username: user.username });

        if (!mem) {//Neu chua co tren BXH  them vao
            const newMem = {
                username: user.username,
                score: user.highestScore
            }
            if (data.length < NUMBER_TOP) {//Neu BXH duoi 10 nguoi thi chi can them vao
                await rankModel(newMem).save();
                return;
            } else {//neu da du 10 nguoi thi loai bo nguoi thap nhat
                const list = await this.getTopRankBoard();
                const smallestScoreMem = list[list.length - 1].username;
                await rankModel.deleteOne({ username: smallestScoreMem });
                await rankModel(newMem).save();
                return;
            }
        } else {//Da ton tai tren BXH thi cap nhat lai diem tren BXH
            await rankModel.findOneAndUpdate({ username: user.username }, { $set: { score: user.highestScore } });
        }
    } catch (error) {
        console.log(error);
    }
}