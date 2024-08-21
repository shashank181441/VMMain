// const crypto = require('crypto');

// // Define encryption algorithm
// const algorithm = 'aes-256-cbc';

// // Generate a key and IV
// const key = crypto.randomBytes(32); // 32 bytes for aes-256-cbc
// const iv = crypto.randomBytes(16);  // 16 bytes IV for aes-256-cbc
// console.log(key, iv);

// // Function to encrypt text
// const encrypt = (text) => {
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return { encryptedData: encrypted, iv: iv.toString('hex') };
// };

// // Function to decrypt text
// const decrypt = (encryptedData, iv) => {
//     const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
//     let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// };

// // Example usage
// const text = 'Hello, World!';
// console.log('Original text:', text);

// // Encrypt the text
// const { encryptedData, iv: encryptedIv } = encrypt(text);
// console.log('Encrypted text:', encryptedData);
// console.log('IV:', encryptedIv);

// // Decrypt the text
// const decryptedText = decrypt(encryptedData, encryptedIv);
// console.log('Decrypted text:', decryptedText);

// const crypto = require('crypto');