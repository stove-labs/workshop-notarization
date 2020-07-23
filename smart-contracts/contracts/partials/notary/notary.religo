#include "./shard/shard.religo"
#include "./claim/claim.religo"

let notary = ((notaryParameter, storage): (notaryParameter, storage)): notaryEntrypointReturn => {
    switch (notaryParameter) {
        | Shard(shardParameter) => shard((shardParameter, storage))
        | Claim(claimParameter) => claim((claimParameter, storage))
    }
}