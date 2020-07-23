#include "types.religo"

type shardOwner = tokenOwner;
type shardOwners = set(shardOwner);
type shardClaimLookupId = (documentHash, shardOwner);
type shardClaim = shardCount;
type claims = big_map(shardClaimLookupId, shardClaim);
type shardOwners = big_map(documentHash, shardOwners);
type remainingShards = big_map(documentHash, shardCount);
type documentHashToTokenId = big_map(documentHash, tokenId);

type notaryStorage = {
    remainingShards: remainingShards,
    /**
     * Helps to find entries in the transitive ledger
     */
    shardOwners: shardOwners,
    // documentHash + shardCount per shardOwner
    claims: claims,
    /**
     * Mirror of a to-be-minted real tokensLedger once
     * all the shards have been claimed.
     * 
     * This serves to reserve storage costs at sharding-time,
     * to lift future costs when claiming the last shards.
     */
    transitiveLedger: tokensLedger,
    /**
     * Used when incrementally generating the transitive tokenLedger
     */
    lastAssignedTokenId: tokenId,
    documentHashToTokenId: documentHashToTokenId
};

type storage = {
    tzip12: tzip12Storage,
    notary: notaryStorage
};