import { hash, signature, signee, signees, signatures, notarizedSignatures } from './types'

/**
 *
 */
export class NotarizedDocument {
  constructor(public hash: hash, private _signatures: signatures) {}

  /**
   *
   */
  public get signees(): signees {
    const signees: signees = []
    this._signatures.forEach((signature: signature, signee: signee) => signees.push(signee))
    return signees
  }

  /**
   *
   */
  public get signatures(): notarizedSignatures {
    const signatures: notarizedSignatures = {}
    this._signatures.forEach((signature: signature, signee: signee) => {
      signatures[signee] = signature
    })
    return signatures
  }

  /**
   *
   */
  public isFullySigned(): boolean {
    return Object.values(this.signatures).indexOf(false) === -1
  }
}
