// include the contract artifacts
const notary = artifacts.require('notary');
const { MichelsonMap } = require('@taquito/taquito');

module.exports = async (deployer) => {
    const initialStorage = new MichelsonMap();
    await deployer.deploy(notary, initialStorage);
}