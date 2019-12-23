const express = require('express');
const jwt = require('jsonwebtoken');
const brcypt = require('bcryptjs');

const User = require('../models/User');

const router = express.Router();

router.post('/register', (req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                brcypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user => {
                            res.json({
                                success: true,
                                message: `${user.email} registerd successfully`
                            })
                                .catch(err => {
                                    res.json({
                                        success: false,
                                        message: `Register failed`,
                                        errors: err
                                    })

                                })
                        })
                })
            }
            else {
                res.json({
                    success: false,
                    message: `${user.email} already used`
                })
            }
        })
})

router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (brcypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.json({
                        success: true,
                        token
                    })
                }
                else {
                    res.json({
                        success: false,
                        errors: 'User or password invalid'
                    })
                }
            }
            else {
                res.json({
                    success: false,
                    errors: `User doesn't exist`
                })
            }
        })
        .catch(err => {
            res.json({
                success: false,
                errors: err
            })
        })
})

router.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                res.json({
                    success: true,
                    message: `User doesn't exist`,
                    user
                })
            }
            else {
                res.json({
                    success: false,
                    message: `User doesn't exist`
                })
            }
        })
        .catch(err => {
            res.json({
                errors: err
            })
        })
})

module.exports = router;