import { hash, signees } from './types'

const noSignees: signees = []

/**
 * Class for managing newly created document for notarization
 */
export class Document {
  constructor(public hash: hash, public signees: signees) {}

  /**
   * Create a new Document from a hash with optional signees
   * @param hash
   * @param signees
   */
  public static fromHash(hash: hash, signees: signees = noSignees) {
    return new Document(hash, signees)
  }
}
