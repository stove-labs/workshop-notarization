/**
 * CID representing the document thats being sharded
 */
type documentHash = string;
/**
 * Number of shards that the `documentHash` is being sharded to
 */
type shardCount = nat;
/**
 * 
 */
type shardDistribution = {
    owner: tokenOwner,
    shardCount: shardCount
};