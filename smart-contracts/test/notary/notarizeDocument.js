const notary = artifacts.require('notary');
const { Tezos } = require('@taquito/taquito');

/**
 * For testing on a babylonnet (testnet), instead of the sandbox network,
 * make sure to replace the keys for alice/bob accordingly.
 */
const { alice, bob } = require('../../scripts/sandbox/accounts');
const documentHash = "6f024c51ca5d0b6568919e134353aaf1398ff090c92f6173f5ce0315fa266b93"

contract('notary', accounts => {
    let storage;
    let notaryInstance;

    before(async () => {
        notaryInstance = await notary.deployed();
        storage = await notaryInstance.storage();
        console.log("notary address:", notaryInstance.address)
    });

    describe('notarizeDocument', () => {
        it('should add a document to the notary', async () => {
            const signees = [alice.pkh, bob.pkh];
            
            /**
             * Notarize a `documentHash` with
             * Alice and Bob as co-signers
             */
            const notarizationOperation = await notaryInstance.notarizeDocument(
                documentHash,
                signees
            );

            const signatures = await storage.get(documentHash);
            const aliceSignature = signatures.get(alice.pkh);
            const bobSignature = signatures.get(bob.pkh);

            // expect two co-signers to exist
            expect(signatures.size).to.equal(2);
            // expect both co-signer signatures to be falsey
            expect(aliceSignature).to.equal(false);
            expect(bobSignature).to.equal(false);
        });
    });
});

module.exports.documentHash = documentHash;