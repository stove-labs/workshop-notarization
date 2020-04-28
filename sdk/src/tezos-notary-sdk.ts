import { address, signatures, signees, signature, signee, Storage } from './types'
import { Contract, ContractMethod } from '@taquito/taquito/dist/types/contract/contract'
import { Tezos } from '@taquito/taquito'
import { NotarizedDocument } from './notarizedDocument'
import { Document } from './document'
/**
 *
 */
class TezosNotarySDK {
  constructor(public contract: Contract) {}

  /**
   *
   */
  get storage(): Promise<Storage> {
    return this.contract.storage<Storage>()
  }

  /**
   * @param document
   */
  public async getDocument(document: Document): Promise<NotarizedDocument> {
    const storage: Storage = await this.storage
    const signatures: signatures = await storage.get(document.hash)
    return new NotarizedDocument(document.hash, signatures)
  }

  /**
   *
   * @param document
   */
  public async isNotarized(document: Document): Promise<boolean> {
    try {
      await this.getDocument(document)
    } catch (error) {
      if (error.status === 404) return false
    }
    return true
  }

  /**
   *
   * @param document
   */
  public notarize(document: Document): ContractMethod {
    return this.contract.methods.notarizeDocument(document.hash, document.signees)
  }

  public sign(document: Document): ContractMethod {
    return this.contract.methods.signDocument(document.hash)
  }
}

/**
 *
 */
const TezosNotarySDKFactory = {
  at: async (address: address): Promise<TezosNotarySDK> => {
    const contract: Contract = await Tezos.contract.at(address)
    return new TezosNotarySDK(contract)
  }
}

export * from './types'
export * from './document'
export { TezosNotarySDK, TezosNotarySDKFactory }
