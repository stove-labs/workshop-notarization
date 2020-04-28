/**
 * We're optimizing the contract for a low amount of co-signees per document,
 * thus a simple `map` is used instead of a `big_map`
 * 
 * Boolean value in this map represents whether or not 
 * the co-signee signed the document hash.
 */
type documentSignature = bool;
type signee = address;
type documentSignatures = map(signee, documentSignature);
/**
 * `documentHash` is a string, instead of bytes. Since we're
 * not using LIGO's Crypto.sha256 in our implementation.
 */
type documentHash = string;

/**
 * Allow for a large number of notarizations to be tracked
 * thanks to optimal storage in a big_map.
 */
type storage = big_map(documentHash, documentSignatures);


