const router = require('express').Router();
const userModel = require('../models/user.model');
const rankModel = require('../models/rank-board.model');
const rankService = require('../services/rank.service');
const helpers = require('../helpers');

router.route('/').get(async (req, res) => {
    try {
        const data = await rankService.getTopRankBoard();
        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(404).json(null);
    }
})

module.exports = router;