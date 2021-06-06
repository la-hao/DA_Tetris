const router = require('express').Router();
const userModel = require('../models/user.model');
const historyModel = require('../models/history.model');
const userController = require('../controllers/user.controller');

const helpers = require('../helpers');

router.route('/').get(async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);

    } catch (error) {
        console.log(error);
        res.status(404).json("Not found");
    }
})

router.route('/:id').get(async (req, res) => {
    try {
        const id = req.params.id;
        const users = await userModel.findOne({ _id: id });
        res.json(users);

    } catch (error) {
        console.log(error);
        res.status(404).json("Not found");
    }
});

router.route('/add').post(async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        //Ton tai username
        if (userController.checkExistUsername(username) == true) {
            res.status(400).json(false);
        }
        else {
            const newUser = {
                username,
                password,//Can Hash
                highestScore: 0,
                histories: []
            }
            await userModel(newUser).save();//Them vao database
            res.json(true);
        }
    } catch (error) {
        res.status(500).json(false);
    }
})
router.route('/history/:id').get(async (req, res) => {
    try {
        const id = req.params.id;
        const data = await userModel.findOne({ _id: id });
        const his = data.histories;
        res.json(his);
    } catch (error) {
        console.log(error);
        res.json(false);
    }
});

router.route('/history/add').post(async (req, res) => {
    try {
        const userId = req.body.userId;
        const score = req.body.score;
        const time = helpers.getDateTime();
        const user = await userModel.findOne({ _id: userId });
        if (user) {
            if (score > user.highestScore) {
                user.highestScore = score;
                // rankBoardController.update({})
            }

            const newHistory = {
                time,
                score
            };

            await user.histories.push(newHistory);
            user.save();

            res.json(true);
        }
        else {
            res.status(400).json(false);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(false);
    }
})

module.exports = router;