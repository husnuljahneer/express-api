const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const _ = require('lodash');

exports.signUp = async (req, res) => {
    const { username, password, email } = req.body;

    const userExist = await prisma.user.findUnique({
        where: {
            email : email
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
            username,
            password: hashedPassword,
            email
        }
    })
    res.json({ message:'User has been created successfully', user });
}