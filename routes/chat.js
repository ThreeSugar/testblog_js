var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');

router.get('/', function(req, res, next) {
    res.render('chat');
});

// app.post("/", async (req, res) => {

//     try {
//         var chat = new Chat(req.body)
//         await chat.save();
//         res.sendStatus(200);

//     } catch (err) {
//         res.sendStatus(500);
//         console.error(err);
//     }
// })

module.exports = router;