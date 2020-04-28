import { MichelsonMap } from '@taquito/taquito'
type address = string
type hash = string
type signee = address
type signees = signee[]
type signature = boolean
type signatures = MichelsonMap<signee, signature>
type notarizedSignatures = Record<signee, signature>

interface Storage {
  get(key: hash): Promise<signatures>
}

interface SendParams {
  fee?: number
  storageLimit?: number
  gasLimit?: number
  amount: number
  source?: string
  mutez?: boolean
}

export {
  address,
  hash,
  signee,
  signees,
  signature,
  signatures,
  notarizedSignatures,
  Storage,
  SendParams
}
