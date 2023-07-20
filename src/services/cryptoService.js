const crypto = require('crypto');

const algorithm = process.env.CRYPTO_ALGORITHM // crpyto algo to use for encryption/decryption
const key = process.env.CRYPTO_KEY; // crypto key used for encryption/decryption
const saltLength = process.env.SALT_LENGTH // 16 length of the salt to use for password hashing
const hashIters = process.env.HASH_ITERATIONS // 100000 how many iterations for hashing passwords
const keyLength = process.env.HASH_KEY_LENGTH // 64 key length for hashing passwords
const hashDigest = process.env.HASH_DIGEST // digest algo used to generate key for hashing passwords

const cryptoService = {
    encrypt: buffer => {
        // generate a new iv for each encryption
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
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    },
    decryptText: text => encryptionService.decrypt(text).toString(),
    hashPassword: (password, callback) => {
        // generate a new salt for each password
        const salt = crypto.randomBytes(saltLength).toString('hex');
        crypto.pbkdf2(password, salt, hashIters, keyLength, hashDigest, (err, derivedKey) => {
            if (err) {
                callback(err);
            } else {
                callback(null, salt + ':' + derivedKey.toString('hex'));
            }
        });
    },
    verifyPassword: (password, hash, callback) => {
        const [salt, key] = hash.split(':');
        crypto.pbkdf2(password, salt, hashIters, keyLength, hashDigest, (err, derivedKey)=>{
            if(err){
                callback(err);
            }else{
                callback(null, key===derivedKey.toString('hex'));
            }
        });
    }
};

module.exports = cryptoService;