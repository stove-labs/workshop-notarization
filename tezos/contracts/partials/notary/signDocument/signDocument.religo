/**
 * Add a truthy signature for `signee` in the given `documentSignatures`
 */
let addSignatureToDocumentSignaturesOrFail =
    (documentSignatures: documentSignatures, signee: signee): documentSignatures => {
        let documentSignature: option(documentSignature) = Map.find_opt(signee, documentSignatures);
        switch (documentSignature) {
            /**
             * If a document signature exists, it means that the current `signee`
             * is an actual co-signee within the given `documentSignatures`.
             * 
             * Note: `documentSignatures` are extracted from the storage
             * per the provided `documentHash` earlier.
             */
            | Some(documentSignature) => {
                if (documentSignature) {
                    // If the signature is truthy, document has been signed already
                    (failwith(documentAlreadySigned): documentSignatures)
                } else { 
                    // if the document signature is falsey, add a truthy signature
                    Map.update(signee, Some(true), documentSignatures);
                }
            };
            // `signee` is not a co-signer for this document
            | None => (failwith(senderIsNotASigneeForThisDocument): documentSignatures) 
        }
    }

/**
 * Sign the given `documentHash` as `Tezos.sender`
 */
let signDocument = (documentHash: signParameter, storage: storage): entrypointReturn => {
    let documentSignatures: option(documentSignatures) = Map.find_opt(documentHash, storage);
    switch (documentSignatures) {
        | Some(documentSignatures) => {
            let signee: signee = Tezos.sender;
            /**
             * Update the documentSignatures with a truthy signature for `signee`
             */
            let documentSignatures: documentSignatures = addSignatureToDocumentSignaturesOrFail(documentSignatures, signee);
            // Update the storage
            let storage: storage = Map.update(
                documentHash,
                Some(documentSignatures),
                storage
            );
            // Output no operations with a new storage value
            (emptyListOfOperations, storage);
        }
        /**
         * If there are no `documentSignatures`, 
         * it means the document has not been yet notarized
         */
        | None => (failwith(documentNotFound): entrypointReturn)
    }
}