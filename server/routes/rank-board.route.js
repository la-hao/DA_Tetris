const router = require('express').Router();
const rankService = require('../services/rank.service');


router.route('/').get(async (req, res) => {
    try {
        const data = await rankService.getTopRankBoard();
        res.send(data);

    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Error in server" });
    }
})

module.exports = router;