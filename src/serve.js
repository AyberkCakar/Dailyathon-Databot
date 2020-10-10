const path = require('path');
const express = require('express');

const app = express();
const routers = require('./routers');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.json('Dailyathon Bot Project');
});

app.use((req, res, next) => {
    res.send("404 NOT FOUND");
});

module.exports = app;