const notary = artifacts.require('notary');
const { MichelsonMap, UnitValue } = require('@taquito/taquito');

const initialStorage = {
    tzip12: {
        tokensLedger: new MichelsonMap,
        tokenOperators: new MichelsonMap,
        token_metadata: new MichelsonMap,
        u: UnitValue,
    },
    notary: {
        remainingShards: new MichelsonMap,
        shardOwners: new MichelsonMap,
        claims: new MichelsonMap,
        transitiveLedger: new MichelsonMap,
        lastAssignedTokenId: 0,
        documentHashToTokenId: new MichelsonMap
    },
};

module.exports = async (deployer) => {
    await deployer.deploy(notary, initialStorage);
};