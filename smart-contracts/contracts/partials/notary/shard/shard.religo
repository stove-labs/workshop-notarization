type shardsIteratorAccumulator = (claims, documentHash);
/**
 * Convert shards into shard claims
 */
let shardsIterator = ((shardsIteratorAccumulator, shardDetails): (shardsIteratorAccumulator, (shardOwner, shardCount))): shardsIteratorAccumulator => {
    let (claims, documentHash) = shardsIteratorAccumulator;
    let (shardOwner, shardCount) = shardDetails;

    let shardClaimLookupId: shardClaimLookupId = (documentHash, shardOwner);
    let claims = Map.update(
        shardClaimLookupId,
        Some(shardCount),
        claims
    );

    (claims, documentHash)
}

/**
 * Generate transitive ledger entries based on given shards
 */
type transitiveLedgerIteratorAccumulator = (tokensLedger, tokenId);
let transitiveLedgerIterator = ((transitiveLedgerIteratorAccumulator, shardDetails): (transitiveLedgerIteratorAccumulator, (shardOwner, shardCount))): transitiveLedgerIteratorAccumulator => {
    let (tokensLedger, newTokenId): transitiveLedgerIteratorAccumulator = transitiveLedgerIteratorAccumulator;
    let (shardOwner, shardCount) = shardDetails;

    let tokenLookupId: tokenLookupId = (shardOwner, newTokenId);

    let tokensLedger = Map.update(
        tokenLookupId,
        Some(shardCount),
        tokensLedger
    );

    (tokensLedger, newTokenId);
};

let shard = ((shardParameter, storage): (shardParameter, storage)): notaryEntrypointReturn => {

    let currentDocumentHashTokenId: option(tokenId) = Map.find_opt(
        shardParameter.documentHash,
        storage.notary.documentHashToTokenId
    );

    switch (currentDocumentHashTokenId) {
        | None => ()
        | Some(tokenId) => failwith("document hash has already been notarized")
    };

    let remainingShards = Map.update(
        shardParameter.documentHash,
        Some(shardParameter.totalShards),
        storage.notary.remainingShards
    );

    let shardOwners = Map.update(
        shardParameter.documentHash,
        Some(shardParameter.shardOwners),
        storage.notary.shardOwners
    );

    let (claims, _): shardsIteratorAccumulator = Map.fold(
        shardsIterator,
        shardParameter.shards,
        (storage.notary.claims, shardParameter.documentHash)
    );

    let newTokenId: tokenId = abs(storage.notary.lastAssignedTokenId + 1);
    let (transitiveLedger, lastAssignedTokenId): transitiveLedgerIteratorAccumulator = Map.fold(
        transitiveLedgerIterator,
        shardParameter.shards,
        (storage.notary.transitiveLedger, newTokenId)
    );

    let documentHashToTokenId: documentHashToTokenId = Map.update(
        shardParameter.documentHash,
        Some(newTokenId),
        storage.notary.documentHashToTokenId
    );

    let storage = {
        ...storage,
        notary: {
            ...storage.notary,
            remainingShards: remainingShards,
            shardOwners: shardOwners,
            claims: claims,
            transitiveLedger: transitiveLedger,
            lastAssignedTokenId: lastAssignedTokenId,
            documentHashToTokenId: documentHashToTokenId
        }
    };

    (([]: list(operation)), storage)
};