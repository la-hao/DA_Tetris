// require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/user.route');
const rankBoardRouter = require('./routes/rank-board.route');

const db = require('./db.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

db.connectMongoose();

app.use(express.static(path.resolve(__dirname, "build")));

app.use(cors());


app.get("/api", (req, res) => {
    const data = { message: "Hello from Server" };
    res.json(data);
})

app.use('/api/user', userRouter);
app.use('/api/rank-board', rankBoardRouter);


//All other GET requests not handled before will return ReactApp
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening at PORT: ${PORT}`)
});