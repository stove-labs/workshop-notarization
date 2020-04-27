#include "../partials/notary/helpers/entrypointReturn.religo"
#include "../partials/notary/errors.religo"
#include "../partials/notary/storage/storage.religo"
#include "../partials/notary/action/action.religo"

#include "../partials/notary/notarizeDocument/notarizeDocument.religo"
#include "../partials/notary/signDocument/signDocument.religo"

/**
 * Main function representing the Notary contract
 */
let main = ((action, storage): (action, storage)) : entrypointReturn => 
  /**
   * Entrypoint routing
   */
  switch (action) {
    | NotarizeDocument(notarizeParameter) => notarizeDocument(notarizeParameter, storage);
    | SignDocument(signParameter) => signDocument(signParameter, storage);
  }