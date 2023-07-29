const crypto = require('crypto');

const algorithm = process.env.CRYPTO_ALGORITHM; // crpyto algo to use for encryption/decryption
const key = process.env.CRYPTO_KEY; // crypto key used for encryption/decryption
const saltLength = parseInt(process.env.SALT_LENGTH); // 16 length of the salt to use for password hashing
const hashIters = parseInt(process.env.HASH_ITERATIONS); // 100000 how many iterations for hashing passwords
const keyLength = parseInt(process.env.HASH_KEY_LENGTH); // 64 key length for hashing passwords
const hashDigest = process.env.HASH_DIGEST; // digest algo used to generate key for hashing passwords
const cryptoService = {
    encrypt: buffer => {
        // generate a new iv for each encryption
        const iv = crypto.randomBytes(16); // initialization vector
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(buffer);
        encrypted = Buffer.concat([iv,encrypted, cipher.final()]);
        return encrypted;
        //return iv.toString('hex') + ':' + encrypted.toString('hex'); // include the IV with the encrypted data
    },
    decrypt: buffer => {
        const iv = buffer.slice(0, 16);
        
        const encrypted = buffer.slice(16);
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    },
    encryptText: text => {
         cryptoService.encrypt(Buffer.from(text)).toString('hex');
    },
    decryptText: text => cryptoService.decrypt(Buffer.from(text, 'hex')).toString(),
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