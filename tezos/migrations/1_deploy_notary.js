const notary = artifacts.require('notary');
const saveContractAddress = require('./../helpers/saveContractAddress');

module.exports = async (deployer, network, accounts) => {
    const { initialStorage } = await require(`./${network}/notary`)
    const contract = await deployer.deploy(notary, initialStorage);
    await saveContractAddress('notary', contract.address);
};
