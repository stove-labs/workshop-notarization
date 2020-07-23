const notary = artifacts.require('notary');
const { MichelsonMap } = require('@taquito/taquito');
const { alice, bob } = require('./../scripts/sandbox/accounts');

const documentHash = '123456';

contract('notary', () => {
    describe('shard', () => {

        let instance, storage;

        beforeEach(async () => {
            instance = await notary.deployed();
            storage = await instance.storage();
            console.log('test contract address', instance.address);
        });

        it('should shard a document', async () => {
            /**
             * Arguments for the `shard` entrypoint
             * are ordered alphabetically, they're not in a record
             */
            await instance.shard(
                // documentHash
                documentHash,
                // shardOwners
                [
                    alice.pkh,
                ],
                // shards
                MichelsonMap.fromLiteral({
                    [`${alice.pkh}`]: 50,
                }),
                // totalShards
                50
            );
        });

        it('should allow claiming of a document', async () => {
            // await instance.claim(documentHash);
        });
    });
});