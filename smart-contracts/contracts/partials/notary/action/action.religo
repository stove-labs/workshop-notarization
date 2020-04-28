// [tz1.., Kt1.., tz1.3252, ..]
type signees = set(signee);
type notarizeParameter = {
    documentHash: documentHash,
    signees: signees
};

type signParameter = documentHash;

/**
 * Entrypoints
 */
type action =
    | NotarizeDocument(notarizeParameter)
    | SignDocument(signParameter)