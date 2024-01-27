import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const keyHex = process.env.KEY;
const ivHex = process.env.IV;

const key = Buffer.from(keyHex, 'hex');
const iv = Buffer.from(ivHex, 'hex');

export class CryptoService {
    static encrypt(text) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(encryptedText) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }
}
