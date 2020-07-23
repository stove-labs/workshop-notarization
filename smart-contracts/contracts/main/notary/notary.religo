#include "../tzip-12/tzip-12-ft-tablespoon.religo"
#include "../../partials/notary/storage/storage.religo"
#include "../../partials/notary/parameter/parameter.religo"

type notaryEntrypointReturn = (list(operation), storage);

#include "../../partials/notary/notary.religo"

/**
 * Notary
 */
let main = ((parameter, storage): (parameter, storage)): (list(operation), storage) => {
    switch (parameter) {
        /**
         * Route TZIP-12 entrypoints to the original TZIP-12 token contract
         */
        | TZIP12_(tzip12Parameter) => {
            /**
             * Wrap up the TZIP-12 function call results into the extended storage of Notary.
             * Bubble up the returned operations as well.
             */
            let (operations, tzip12Storage): (list(operation), tzip12Storage) = tzip12((tzip12Parameter, storage.tzip12));
            (
                operations,
                {
                    ...storage,
                    tzip12: tzip12Storage
                }
            )
        }
        | Notary(notaryParameter) => notary((notaryParameter, storage));
    }
};