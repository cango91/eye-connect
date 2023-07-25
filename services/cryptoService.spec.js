describe("cryptoService", () => {
    let cryptoService;

    beforeAll(() => {
        require('dotenv').config();
        cryptoService = require('./cryptoService');
    })

    it("hashPassword should return hash with unique salt each time it is called", async () => {
        const password = '1234abc!!@@++//';
        let hash1, hash2, verify1, verify2;
        await new Promise((resolve, reject) => {
            cryptoService.hashPassword(password, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    hash1 = hash;
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            cryptoService.hashPassword(password, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    hash2 = hash;
                    resolve();
                }
            });
        });
        expect(hash1).not.toEqual(hash2);
    });

    it("verifyPassword should verify different hashes of the same password", async () => {
        const password = 'asfaf2941@#$%';
        let hash1, hash2;
        hash1 = await new Promise((resolve, reject) => {
            cryptoService.hashPassword(password, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        hash2 = await new Promise((resolve, reject) => {
            cryptoService.hashPassword(password, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        verify1 = await new Promise((resolve, reject) => {
            cryptoService.verifyPassword(password, hash1, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        verify2 = await new Promise((resolve, reject) => {
            cryptoService.verifyPassword(password, hash2, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        expect(hash1).not.toEqual(hash2);
        expect(verify1).toBeTruthy();
        expect(verify2).toBeTruthy();
    });

    it("encryptText should return a different text each time it is called", () => {
        const text = "this is sensitive text";
        let hiddenText1, hiddenText2;
        hiddenText1 = cryptoService.encryptText(text);
        hiddenText2 = cryptoService.encryptText(text);
        expect(hiddenText1).not.toEqual(hiddenText2);
    });

    it("decryptText should resolve different encrypted texts of the same message to original message", () => {
        const text = "this is sensitive text";
        let hiddenText1, hiddenText2, resolvedText1, resolvedText2;
        hiddenText1 = cryptoService.encryptText(text);
        hiddenText2 = cryptoService.encryptText(text);
        resolvedText1 = cryptoService.decryptText(hiddenText1);
        resolvedText2 = cryptoService.decryptText(hiddenText2);
        expect(hiddenText1).not.toEqual(hiddenText2);
        expect(resolvedText1).toEqual(resolvedText2);
        expect(resolvedText1).toEqual(text);            
    });

    it("Should correctly encrypt and decrypt image data", async ()=>{
        const url = "https://i.imgur.com/wJ8In7h.jpeg";
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const originalImage = Buffer.from(arrayBuffer);
        const encryptedImage = cryptoService.encrypt(originalImage);
        const decryptedImage = cryptoService.decrypt(encryptedImage);
        expect(encryptedImage).not.toEqual(originalImage);
        expect(decryptedImage).toEqual(originalImage);
    });
});