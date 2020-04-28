import { Tezos, Signer } from '@taquito/taquito';
import { TezBridgeSigner } from '@taquito/tezbridge-signer'
/**
 * Address of the deployed notary from our smart-contract migration
 */
import notaryAddress from './../../smart-contracts/deployments/notary';

/**
 * Configure the RPC node url
 */
const rpc: string = 'http://localhost:8732';
/**
 * Configure the taquito signer
 */
const signer: Signer = new TezBridgeSigner();
Tezos.setProvider({
    rpc, signer
});

export { notaryAddress };