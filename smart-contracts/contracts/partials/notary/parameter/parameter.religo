type shards = map(shardOwner, shardCount);
type shardOwners = set(shardOwner);
/**
 * Provide a hash to be sharder and the way it should be split
 */
type shardParameter = {
    documentHash: documentHash,
    /**
     * It's a design decision for the sake of this example
     * to rely on `totalShards` count from the client side,
     * rather than computing it from the provided map of shards.
     */
    totalShards: shardCount,
    /**
     * Used to clean up the transitive ledger
     */
    shardOwners: shardOwners,
    shards: shards
};
/**
 * Provide a hash to claim shards of
 */
type claimParameter = documentHash;

type notaryParameter =
    | Shard(shardParameter)
    | Claim(claimParameter)

type parameter = 
    /**
     * Trailing underscore to avoid `duplicate constructor` errors
     * Thanks to how entrypoint annotations are resolved in michelson/taquito
     * the underscore won't posses a problem - because only the lowest level annotations are relevant.
     */
    | TZIP12_(tzip12Parameter)
    | Notary(notaryParameter)