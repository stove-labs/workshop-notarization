const notary = artifacts.require('notary');
const { alice, bob } = require('../scripts/sandbox/accounts');

contract('notary', () => {

    let notaryInstance;

    before(async () => {
        notaryInstance = await notary.deployed();
        console.log('address', notaryInstance.address);
    });

    describe('notarizeDocument', () => {
        it('should call notarizeDocument', async () => {
            const hash = "this-is-a-hash";
            const signees = [
                alice.pkh,
                bob.pkh
            ];

            await notaryInstance.notarizeDocument(
                hash,
                signees
            );
        });
    })
});