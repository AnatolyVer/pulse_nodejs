import path, {dirname} from "path";
import {fileURLToPath} from 'url';
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import {Storage} from '@google-cloud/storage'

import User from '../models/user.js'
import {userDto} from "../dto/userDto.js";
import TokenService from "./tokenService.js";

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = path.join(__dirname, process.env.PATH_TO_CLOUD_JSON);
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const storage = new Storage({ projectId: process.env.CLOUD_PROJECT_ID })
const bucketName = process.env.GOOGLE_BUCKET_NAME
const bucket = storage.bucket(bucketName)

export default class UserService {

    //refactored
    static async createUser({username, nickname, password}) {
        try{
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())
            const newUser = await User.create({username, nickname, password: hashedPassword})
            const {accessToken, refreshToken} = await TokenService.generateTokens(newUser)
            newUser.sessions.push({accessToken, refreshToken})
            await newUser.save()
            return {accessToken, refreshToken, _id:newUser._id}
        }catch (e) {
            console.error(e)
            throw new Error(e.message)
        }
    }

    static async logUser({username}) {
        try{
            const user = await User.findOne({ username });
            const {accessToken, refreshToken} = await TokenService.generateTokens(user)
            user.sessions.push({accessToken, refreshToken})
            await user.save()
            return {accessToken, refreshToken, _id:user._id}
        }catch (e) {
            console.error(e)
            throw new Error(e.message)
        }
    }

    static async getUser(id) {
        try{
            const user = await User.findById(id)
            return new userDto(user)
        }catch (e) {
            throw new Error(e.message)
        }
    }

    static async logOut(req, res) {
        try{
            const accessToken = req.headers['access-token']
            const refreshToken = req.headers['refresh-token']

            const {_id} = jwt.decode(refreshToken)
            const user = await User.findById(_id)

            const index = user.sessions.findIndex(session => session.accessToken === accessToken && session.refreshToken === refreshToken)

            user.sessions.splice(index, 1);
            await user.save()

            res.status(200).end()
        }catch (e) {
            console.error(e)
            res.status(404).send("User not found")
        }
    }


    static async updateUser(updatedUser, id, res){
        try {
            const user = await User.findById(id)

            const isSameUsername = await User.findOne({username: updatedUser.username})
            if (isSameUsername) return res.status(404).send("Username is already used")

            for (let key in updatedUser) {
                if (key !== 'id') {
                    user[key] = updatedUser[key];
                }
            }
            await user.save()
            res.status(200).send(id)
        }catch (e) {
            console.error(e)
            res.status(404).send("Some issues with updating")
        }
    }

    static async setAvatar(avatar, fileName) {
        try {
            const gcsFile = bucket.file(fileName);

            const stream = gcsFile.createWriteStream({
                metadata: {
                    contentType: avatar.mimetype,
                },
            });

            stream.on('error', (err) => {
                throw new Error('Error uploading file:' + err.message);
            });

            stream.on('finish', async () => {
                console.log('The file has been successfully uploaded to Google Cloud Storage.');
            });
            stream.end(avatar.buffer);
            return await this.getAvatar(gcsFile);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async getAvatar(fileName) {
        try {
            const currentDate = new Date();
            const expiresDate = new Date(currentDate);
            expiresDate.setFullYear(currentDate.getFullYear() + 1);

            const [url] = await fileName.getSignedUrl({
                action: 'read',
                expires: expiresDate.toISOString(),
            });

            return url + `&data=${Date.now()}`;
        } catch (e) {
            throw new Error(e.message);
        }
    }
}