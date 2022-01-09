const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const CreateError = require('http-errors');
const logger = require('../utils/logger');
require("dotenv").config();

exports.createUser = async ({name,email,password}) => {
    try {
        const userExist = await prisma.user.findUnique({
            where: {
                email
            }
        });
    
        if (userExist) {
            throw CreateError(409, 'User already exists');
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const user = await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email
            }
        })
        return user;
    } catch (err) {
        logger.error(err);
        throw CreateError(400, err.message);
    }
}

exports.generateAccessToken = (payload) => {
    return jwt.sign(
        payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

exports.generateRefreshToken = (payload) => {
    return jwt.sign(
        payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

exports.verifyRefreshToken = (refreshToken) => {
    return jwt.sign(
        refreshToken, process.env.JWT_REFRESH_SECRET);
}

exports.loginUser = async ({email, password}) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });
    
        if (!user) {
            throw CreateError(400, 'Invalid Email or Password');
        }
    
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw CreateError(401, 'Invalid Email or Password');
        }
        return user;
    } catch (err) {
        logger.error(err);
        throw CreateError(400, err.message);
    }
    
}