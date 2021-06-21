const router = require('express').Router();
const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');
const historyModel = require('../models/history.model');
const userService = require('../services/user.service');
const rankService = require('../services/rank.service');
const helpers = require('../helpers');
const { generateToken } = require('../utils');

// router.route('/').get(async (req, res) => {
//     try {
//         const users = await userModel.find({});
//         res.json(users);

//     } catch (error) {
//         console.log(error);
//         res.status(404).json("Not found");
//     }
// })

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

//Dang ky tai khoan
router.route('/signup').post(async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        //Ton tai username
        const existUsername = await userService.checkExistUsername(username);

        if (existUsername) {
            res.status(400).send({ message: "Username is being used" });
        } else {
            //Hash password
            const saltRounds = 10;
            const hash = bcrypt.hashSync(password, saltRounds);

            const newUser = {
                username,
                password: hash,
                highestScore: 0,
            }

            await userModel(newUser).save();//Them vao database
            res.send({ message: "Register new account successfully!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in server" });
    }
});

//Dang nhap
router.route('/signin').post(async (req, res) => {
    try {
        const username = req.body.username || '';
        const password = req.body.password || '';

        const user = await userModel.findOne({ username: username });

        if (user) {
            const hash = user.password;
            const result = bcrypt.compareSync(password, hash);

            if (result == true) {
                const response = {
                    username: user.username,
                    _id: user._id,
                    highestScore: user.highestScore,
                    token: generateToken(user),
                }
                res.send(response);
            } else {
                res.status(401).send({ message: "Password is incorrect" });
            }
        } else {
            res.status(401).send({ message: "Invalid username" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in server" });
    }
})

//Doi mat khau
router.route('/change-password').post(async (req, res) => {
    try {
        const username = req.body.username;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            res.status(401).send({ message: "Username does not exist" });
            return;
        }

        const hash = user.password;
        const result = bcrypt.compareSync(currentPassword, hash);

        if (result == true) {
            const saltRounds = 10;
            const hashNewPassword = bcrypt.hashSync(newPassword, saltRounds);

            user.password = hashNewPassword;
            await user.save();
            res.send({ message: "Change password successfully!!" });
        }
        else {
            res.status(401).send({ message: "Incorrect password!" });
        }
    } catch (error) {
        console.log(error);
    }
})

//Lich su nguoi choi
router.route('/:id/history').get(async (req, res) => {
    try {
        const id = req.params.id;
        const data = await historyModel.findOne({ userId: id });

        if (data) {
            const his = await data.histories.sort((a, b) => helpers.parseDateTime(b.time) - helpers.parseDateTime(a.time));
            res.send(his);
        }
        else {
            res.send([]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in server" });
    }
});
router.route('/:id/history').delete(async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await historyModel.deleteOne({ userId: userId });
        if (result.deletedCount > 0) {
            res.send({ message: "Delete history successfully !" });
        }
        else {
            res.status(401).send({ message: "Failed to delete! Please try later!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to delete! Please try later!" });
    }
})

router.route('/:id/history/add').post(async (req, res) => {
    try {
        const userId = req.params.id;
        const score = req.body.score;
        const time = helpers.getDateTime();
        const user = await userModel.findOne({ _id: userId });


        if (user) {
            //Xem xet cap nhat BXH
            if (score > user.highestScore) {
                //Cap nhat highest score vao database
                user.highestScore = score;
                await user.save();

                const abledToUpdateRank = await rankService.abledToUpdateRank(score);

                if (abledToUpdateRank) {//Cap nhat BXH
                    await rankService.updateRankBoard(user);
                } else {
                    //do nothing
                }
            }

            const newHistory = {
                time,
                score
            };
            const userHistories = await historyModel.findOne({ userId: userId });

            if (userHistories) {//Da ton tai Lich su trong bang lich su
                await userHistories.histories.push(newHistory);
                userHistories.save();
            } else {//Nguoi choi chua co lich su trong bang Lich su => Them moi
                const newUserHistory = {
                    username: user.username,
                    userId: user._id,
                    histories: [newHistory],
                }
                await historyModel(newUserHistory).save();
            }

            res.send({ message: "Add new history successfully!" });

        } else {//Khong ton tai user
            res.status(404).send({ message: "User not found" });
        }

    } catch (error) {
        console.log(error);

        if (req.params.id.length != 24) {//Khong dung do dai Id cua Mongoose
            res.status(404).send({ message: "User not found" });
        } else {
            res.status(500).send({ message: "Error in server" });
        }
    }
})

module.exports = router;