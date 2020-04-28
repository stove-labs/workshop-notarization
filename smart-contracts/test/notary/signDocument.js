const notary = artifacts.require('notary');
const { documentHash } = require('./notarizeDocument');
/**
 * For testing on a babylonnet (testnet), instead of the sandbox network,
 * make sure to replace the keys for alice/bob accordingly.
 */
const { alice, bob } = require('../../scripts/sandbox/accounts');

contract('notary', accounts => {
    let storage;
    let notaryInstance;

    before(async () => {
        notaryInstance = await notary.deployed();
        storage = await notaryInstance.storage();
    });

    describe('signDocument', () => {
        it('should add a signature to a notarized document', async () => {
            /**
             * Sign a document hash that has been previously notarized.
             * Signee is always the address which signed the transaction,
             * which is Alice as defined in `truffle-config.js`.
             */
            await notaryInstance.signDocument(documentHash);

            const signatures = await storage.get(documentHash);
            const aliceSignature = signatures.get(alice.pkh);
            const bobSignature = signatures.get(bob.pkh);

            // expect two co-signers to exist
            expect(signatures.size).to.equal(2);
            // expect the signature for alice to be truthy
            expect(aliceSignature).to.equal(true);
            // expect the signature for bob to be falsey
            expect(bobSignature).to.equal(false);
        });
    });
});
