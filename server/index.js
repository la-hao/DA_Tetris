const path = require('path');
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(cors());

app.get("/api", (req, res) => {
    const data = { message: "Hello from Server" };
    res.json(data);
})

//All other GET requests not handled before will return ReactApp
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'client/index.html'));
})

app.listen(PORT, () => console.log(`Server listening at PORT: ${PORT}`));