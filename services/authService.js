const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const _ = require('lodash');
const jwt = require('jsonwebtoken');

exports.signUp = async ({name,email,password}}) => {
    const { name, password, email } = req.body;

    const userExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (userExist) {
        return res.status(400).json({
            message: 'User already exist'
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
        data: {
            name,
            password: hashedPassword,
            email
        }
    })
    res.json({ message:'User has been created successfully', user });
}

exports.generateAccessToken = (payload) => {
    return jwt.sign(
        payload, 'secret', { expiresIn: '15m' });
}

exports.generateRefreshToken = (payload) => {
    return jwt.sign(
        payload, 'refeshSecret', { expiresIn: '7d' });
}

exports.verifyRefreshToken = (refreshToken) => {
    return jwt.sign(
        refreshToken, 'refreshToken');
}

exports.login = async ({email, password}) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Please provide email and password'
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }
}