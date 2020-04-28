#include "../storage/storage.religo"
/**
 * Unique set of addresses which will be able
 * to co-sign the document.
 */
type signees = set(signee);
/**
 * Parameter for the `NotarizeDocument` entrypoint,
 * accepting a hash to be notarized along with a set of signees.
 */
type notarizeParameter = {
    documentHash: documentHash,
    signees: signees
};
/**
 * Parameter for the `SignDocument` entrypoint,
 * accepting a single document hash to be signed.
 */
type signParameter = documentHash;

type action = 
    /**
     * Propose a new document hash to notarize
     */
    | NotarizeDocument(notarizeParameter)
    /**
     * Sign an existing document with a new signature
     */
    | SignDocument(signParameter);