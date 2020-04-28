/**
 * Given a set of signees, return a map of 'falsey' signee signatures
 */
let getEmptydocumentSignatures = (signees: signees): documentSignatures => {
    Set.fold(((documentSignatures, signee): (documentSignatures, signee)) => {
        Map.update(signee, Some(false), documentSignatures);
    }, signees, (Map.empty : documentSignatures))
}

/**
 * Given a document hash with signees, add the document to the storage
 * and append an empty set of signee signatures
 */
let addDocumentHashWithSigneesToNotary = (documentHash: documentHash, signees: signees, storage: storage): storage => {
    let documentSignatures: documentSignatures = getEmptydocumentSignatures(signees);
    Map.update(documentHash, Some(documentSignatures), storage);
};

/**
 * Notarize a document if it has not yet been notarized, fail othwerise.
 */
let notarizeDocument = (notarizeParameter: notarizeParameter, storage: storage): entrypointReturn => {
    let documentSignatures: option(documentSignatures) = Map.find_opt(notarizeParameter.documentHash, storage);
    switch (documentSignatures) {
        // if the document is already notarized in the storage, fail with a predefined error message
        | Some(documentSignatures) => (failwith(documentHashAlreadyNotarized) : entrypointReturn)
        // if the document is not yet notarized, notarize it
        | None => {
            let storage: storage = addDocumentHashWithSigneesToNotary(
                notarizeParameter.documentHash,
                notarizeParameter.signees,
                storage
            );
            // return no operations and the new storage value
            (([] : list (operation)), storage);
        }
    }
};