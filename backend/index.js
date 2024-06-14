import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { User, FriendRequest, Chat, Group, Room, RoomMember } from './models/models.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        console.log(username, email, password, confirmPassword);
        const existing_email = await User.findOne({ 'email': email });
        const existing_username = await User.findOne({ 'username': username });
        if (password !== confirmPassword) {
            res.status(409).json({ 'message': 'Password do not matched' });
        } else if (existing_email) {
            console.log(existing_email);
            res.status(409).json({ 'message': 'Email already registered' });
        } else if (existing_username) {
            console.log(existing_username);
            res.status(409).json({ 'message': 'Username already registered' });
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            console.log(hashPassword);
            const data = await User.create({
                username: username,
                email: email,
                password: hashPassword
            });
            const token = jwt.sign({ user: data }, process.env.JWT_KEY, { 'expiresIn': '1h' });
            res.status(200).send({ 'token': token });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({'error' : error});
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing_user = await User.findOne({ 'username': username });
        if (!existing_user) {
            res.status(409).send({ 'message': 'Username does\'nt exists' });
        } else {
            const isPasswordvalid = await bcrypt.compare(password, existing_user.password);
            if (!isPasswordvalid) {
                res.status(409).send({ 'message': 'Wrong Credentials' })
            } else {
                const token = jwt.sign({ user_id: existing_user }, process.env.JWT_KEY, { 'expiresIn': '1h' });
                res.status(200).send({ 'token': token });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({'error' : error});
    }
})

const login_required = (req, res, next) => {
    try {
        const auth_header = req.headers['authorization'];
        const token = auth_header && auth_header.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 'message': 'authentication token missing' })
        }

        const user = jwt.verify(token, process.env.JWT_KEY);
        req.user = user;
        console.log(user);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    
}

app.get('/protected', login_required, async (req, res) => {
    res.send('protected');
})

mongoose.connect(process.env.MONGOURI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('server in running at ', process.env.PORT);
        })
    }).catch(error => {
        console.log(error);
    })


