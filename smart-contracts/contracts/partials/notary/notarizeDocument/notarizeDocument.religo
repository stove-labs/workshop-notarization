// notarizeParameter = { documentHash, signees }
let notarizeDocument = (notarizeParameter: notarizeParameter, storage: storage): (list(operation), storage) => {
    let signees: signees = notarizeParameter.signees;
    let documentHash: documentHash = notarizeParameter.documentHash;

    let documentSignatures: option(documentSignatures) = Map.find_opt(documentHash, storage);

    switch (documentSignatures) {
        | Some(documentSignatures) => (failwith("Document already notarized"): (list(operation), storage))
        | None => {
            let documentSignatures: documentSignatures = Set.fold(((documentSignatures, signee): (documentSignatures, signee)) => {
                Map.update(signee, Some(false), documentSignatures);
            }, signees, (Map.empty: documentSignatures));

            let storage = Map.update(documentHash, Some(documentSignatures), storage);

            (([]: list(operation)), storage);
        }
    }
}