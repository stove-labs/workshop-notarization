import { hash, signature, signee, signees, signatures, notarizedSignatures } from './types'

/**
 * Flavour of the Document that has already been notarized
 */
export class NotarizedDocument {
  public signees: signees = []
  constructor(public hash: hash, private _signatures: signatures) {
    this.signees = this.getSigneesFromSignatures(_signatures)
  }

  /**
   *  Get an array of signees based on the signatures map
   */
  private getSigneesFromSignatures(signatures: signatures): signees {
    const signees: signees = []
    this._signatures.forEach((signature: signature, signee: signee) => signees.push(signee))
    return signees
  }

  /**
   *  Turn the MichelsonMap into a simple object of signatures
   */
  public get signatures(): notarizedSignatures {
    const signatures: notarizedSignatures = {}
    this._signatures.forEach((signature: signature, signee: signee) => {
      signatures[signee] = signature
    })
    return signatures
  }

  /**
   *  Check if all the signatures are falsey, if yes return true
   */
  public isFullySigned(): boolean {
    return Object.values(this.signatures).indexOf(false) === -1
  }
}
