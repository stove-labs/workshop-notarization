let signDocument = (documentHash: signParameter, storage: storage): (list(operation), storage) => {
    let documentSignatures: option(documentSignatures) = Map.find_opt(documentHash, storage);
    switch (documentSignatures) {
        | None => (failwith("Document not found"): (list(operation), storage))
        | Some(documentSignatures) => {
            // person who signs the transaction invoking the contract
            let signee: signee = Tezos.sender;
            let documentSignature: option(documentSignature) = Map.find_opt(signee, documentSignatures);

            switch(documentSignature) {
                | None => (failwith("Sender is not a signee for this document"): (list(operation), storage))
                | Some(documentSignature) => {
                    if (documentSignature) {
                        (failwith("Document already signed by the sender"): (list(operation), storage))
                    } else {
                        // if we were in the JS world: storage[documentHash].alice = true
                        // change the signature to true in the signatures map
                        let documentSignatures: documentSignatures = Map.update(signee, Some(true), documentSignatures);
                        // update the storage with new signatures
                        let storage: storage = Map.update(documentHash, Some(documentSignatures), storage);
                        // return the new storage value
                        (([]: list(operation)), storage);
                    }
                }
            }

            
        }
    }
}