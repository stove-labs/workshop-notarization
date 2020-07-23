type tokensLedgerIteratorAccumulator = (tokensLedger, tokenId, tokensLedger);
let tokensLedgerIterator = ((tokensLedgerIteratorAccumulator, shardOwner): (tokensLedgerIteratorAccumulator, shardOwner)): tokensLedgerIteratorAccumulator => {
    let (tokensLedger, tokenId, transitiveLedger) = tokensLedgerIteratorAccumulator;
    
    let tokenLookupId: tokenLookupId = (shardOwner, tokenId);
    let transitiveTokenBalance: option(tokenBalance) = Map.find_opt(
        tokenLookupId,
        transitiveLedger
    );

    let transitiveTokenBalance: tokenBalance = switch (transitiveTokenBalance) {
        | None => (failwith("There isnt any balance to transfer to the real ledger"): tokenBalance)
        | Some(tokenBalance) => tokenBalance
    };

    let tokensLedger = Map.update(
        tokenLookupId,
        Some(transitiveTokenBalance),
        tokensLedger
    );

    let transitiveLedger = Map.remove(
        tokenLookupId,
        transitiveLedger
    );

    (tokensLedger, tokenId, transitiveLedger);
};

let claim = ((claimParameter, storage): (claimParameter, storage)): notaryEntrypointReturn => {
    let documentHash = claimParameter;
    let shardOwner = Tezos.sender;
    // check if there is a valid claim to claim
    let shardClaimLookupId: shardClaimLookupId = (documentHash, shardOwner);
    let currentClaim: option(shardClaim) = Map.find_opt(
        shardClaimLookupId,
        storage.notary.claims
    );
    let transitiveLedger = storage.notary.transitiveLedger;
    let tokensLedger = storage.tzip12.tokensLedger;

    let currentClaim: shardClaim = switch (currentClaim) {
        | None => (failwith("There is no claim to fulfill"): shardClaim)
        | Some(currentClaim) => currentClaim
    };

    /**
     * check if there are no more claims to make 
     * and then move the transitive ledger values to the real ledger
     * using the `shardOwners` address set
     */
    let numberOfShardsLeft: option(shardCount) = Map.find_opt(
        documentHash,
        storage.notary.remainingShards
    );

    let numberOfShardsLeft: shardCount = switch (numberOfShardsLeft) {
        | None => (failwith("there are no shards left to claim"): shardCount)
        | Some(shardCount) => shardCount
    };

    if ((numberOfShardsLeft - currentClaim) < 0) {
        failwith("There isnt enough shards left for to fulfill your claim");
    } else { (); };

    let shardOwners: option(shardOwners) = Map.find_opt(
        documentHash,
        storage.notary.shardOwners
    );

    let shardOwners: shardOwners = switch (shardOwners) {
        | None => (failwith("There are no shard owners for the given documentHash"): shardOwners)
        | Some(shardOwners) => shardOwners
    };

    let currentTokenId: option(tokenId) = Map.find_opt(
        documentHash,
        storage.notary.documentHashToTokenId
    );

    let currentTokenId: tokenId = switch (currentTokenId) {
        | None => (failwith("There is no tokenId associated with this documentHash"): tokenId)  
        | Some(tokenId) => tokenId
    };

    let (tokensLedger, _, transitiveLedger) = if ((numberOfShardsLeft - currentClaim) == 0) {
        Set.fold(
            tokensLedgerIterator,
            shardOwners,
            (storage.tzip12.tokensLedger, currentTokenId, storage.notary.transitiveLedger)
        ); 
    } else {
        (tokensLedger, currentTokenId, transitiveLedger);
    };

    let claims = Map.remove(
        shardClaimLookupId,
        storage.notary.claims
    );

    // decrease the number of remaining shards after a successful claim
    let numberOfShardsLeft: shardCount = if ((numberOfShardsLeft - currentClaim) < 0) {
        0n;
    } else {
        abs(numberOfShardsLeft - currentClaim);
    };

    let remainingShards = Map.update(
        documentHash,
        Some(numberOfShardsLeft),
        storage.notary.remainingShards
    );

    let storage = {
        ...storage,
        tzip12: {
            ...storage.tzip12,
            tokensLedger: tokensLedger
        },
        notary: {
            ...storage.notary,
            remainingShards: remainingShards,
            transitiveLedger: transitiveLedger,
            claims: claims
        }
    };

    (([]: list(operation)), storage);
}