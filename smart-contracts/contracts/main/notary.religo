#include "./../partials/notary/storage/storage.religo"
#include "./../partials/notary/action/action.religo"
#include "./../partials/notary/notarizeDocument/notarizeDocument.religo"
#include "./../partials/notary/signDocument/signDocument.religo"

// single function main represents a contract
// takes a touple as a parameter
// touple (action/parameter, storage)
// (parameter, storage) -> logic without side effects -> (list(operations), storage)
let main = ((action, storage): (action, storage)): (list(operation), storage) => {
    switch (action) {
        | NotarizeDocument(notarizeParameter) => notarizeDocument(notarizeParameter, storage)
        | SignDocument(signParameter) => signDocument(signParameter, storage)
    }
}