#include "types.religo"

type shardOwner = tokenOwner;
type shardClaimLookupId = (documentHash, shardOwner);
type shardClaim = {
    claimed: bool,
    shardCount: shardCount,
};
type notaryStorage = {
    // documentHash + totalShardCount
    remainingShards: big_map(documentHash, shardCount),
    // documentHash + shardCount per shardOwner
    claims: big_map(shardClaimLookupId, shardCount),
    /**
     * Mirror of a to-be-minted real tokensLedger once
     * all the shards have been claimed.
     * 
     * This serves to reserve storage costs at sharding-time,
     * to lift future costs when claiming the last shards.
     */
    transitiveLedger: tokensLedger
};

type storage = {
    tzip12: tzip12Storage,
    notary: notaryStorage
};