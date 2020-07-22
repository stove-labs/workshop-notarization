const eztz = require('eztz.js').eztz;
function generateAddress() {
    // let mnemonic = eztz.crypto.generateMnemonic(); // generate mnemonic phrase
    let mnemonic = 'faculty family model demand target extra vacuum purchase across debris feel bless tiger token tiger'
    let password = Math.random().toString(36).substring(2, 15); // generate password
    let wallet = eztz.crypto.generateKeys(mnemonic, password); // create wallet by password and mnemonic
    return wallet;
};

module.exports = generateAddress