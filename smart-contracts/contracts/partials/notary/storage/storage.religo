// tz1.. KT1..
type signee = address;
type documentSignature = bool;
type documentHash = string;
type documentSignatures = map(signee, documentSignature);
// big_map(key, value)
type storage = big_map(documentHash, documentSignatures);