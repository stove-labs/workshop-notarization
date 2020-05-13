import { Tezos } from "@taquito/taquito"
import { InMemorySigner } from '@taquito/signer'

const { alice } = require('../../smart-contracts/scripts/sandbox/accounts')

export module faucet {

    export async function drip(recipient: string, amount: number){
       
        Tezos.setSignerProvider(await InMemorySigner.fromSecretKey(alice.sk))
        const transactionOperation = await Tezos.contract.transfer({ to: recipient, amount: amount })
        await transactionOperation.confirmation(1)
    }
}


