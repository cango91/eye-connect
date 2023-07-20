const crypto = require('crypto');

const algorithm = process.env.CRYPTO_ALGORITHM //'aes-256-cbc';
const key = process.env.CRYPTO_KEY; // 32-bytes crypto.randomBytes


const cryptoService = {
    encrypt: buffer => {
        const iv = crypto.randomBytes(16); // initialization vector
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(buffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex'); // include the IV with the encrypted data
    },
    encryptText: text => encryptionService.encrypt(Buffer.from(text)),
    decrypt: text => {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encrypted = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm,Buffer.from(key,'hex'),iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted,decipher.final()]);
        return decrypted;
    },
    decryptText: text => encryptionService.decrypt(text).toString()
};

module.exports = cryptoService;