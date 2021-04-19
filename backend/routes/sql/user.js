const express = require('express');
const db = require('../../models/sql');
const app = require('../../server');
// const passwordHash = require('password-hash');

const router = express.Router();

app.post('/login',async (req,res) => {
    console.log("Inside Login Post Request");
    // try {
    //     const user = await db.User.findOne({
    //         where: {
    //             email: req.body.email
    //         }
    //     });
    //     if (user === null) {
    //         return res.status(404).send("User not found!");
    //     }
    //     else if (passwordHash.verify(req.body.password, user.dataValues.password)) {
    //         req.session.user = user;
    //         return res.status(200).send(user);
    //     }
    //     return res.status(401).send("UnAuthorized!");
    // }
    // catch (err) {
    //     console.log(err);
    // }
    // return res.status(500).send("Internal Server Error!");
});

app.post('/signup', async (req, res) => {
	console.log("Inside Sign up Post Request");
	try {
		const user = await db.User.create({
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
		})
		// req.session.user = user;
		return res.status(200).send(user)
	} catch (error) {
		console.log(error);
	}
	return res.status(500).send("Internal Server Error!");
});

module.exports = router;