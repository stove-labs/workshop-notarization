// function generateAddress() {

//     const eztz = require('eztz.js').eztz;
//     let mnemonic = eztz.crypto.generateMnemonic(); // generate mnemonic phrase
//     let password = Math.random().toString(36).substring(2, 15); // generate password
//     let wallet = eztz.crypto.generateKeys(mnemonic, password); // create wallet by password and mnemonic
//     return wallet.pkh;
// };

const { crypto } = require('sotez');



module.exports = async () => {
    const mnemonic = crypto.generateMnemonic();
    const keys = await crypto.generateKeys(mnemonic, '');
    return keys.pkh;
}