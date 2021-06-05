const path = require('path');
const express = require('express');
const cors = require('cors');
const userService = require('./model/userService');
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

app.get("/accounts", async (req, res) => {
    try {
        const data = await userService.getAll();
        console.log('list: ', data);
        res.status(200).json(data);
    } catch (error) {
        console.log("error to get items", error);
    }

})

//All other GET requests not handled before will return ReactApp
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening at PORT: ${PORT}`)
});