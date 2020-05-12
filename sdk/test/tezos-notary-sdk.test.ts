import { Tezos } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'
import { TezosNotarySDK, TezosNotarySDKFactory, Document } from '../src/tezos-notary-sdk'
import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation'
import { NotarizedDocument } from '../src/notarizedDocument'
import { constants } from '../helpers/constants'

/**
 * Set a long timeout due to time inbetween blocks
 */
jest.setTimeout(50000)

/**
 * Local sandboxed RPC node
 */
const rpc = 'http://localhost:8732'
/**
 * Get the address of the latest migrated Notary contract
 */
const notaryAddress = require('../../smart-contracts/deployments/notary')
/**
 * Accounts from the sandbox
 */
const { alice, bob } = require('../../smart-contracts/scripts/sandbox/accounts')
/**
 * sha256 hash of our document `never trust a skinny chef`
 */
const hash = '36d87a683cfb033dcdb751723d5ef32085988716ce87a30c4ee3844992510a6a'
/**
 * Signees for notarization of the document hash above
 */
const signees = [alice.pkh, bob.pkh]

/**
 * Set Alice as a signer for testing purposes
 */
function setAliceAsSigner() {
  Tezos.setProvider({
    rpc,
    signer: new InMemorySigner(alice.sk)
  })
}

/**
 * Set Bob as a signer for testing purposes
 */
function setBobAsSigner() {
  Tezos.setProvider({
    rpc,
    signer: new InMemorySigner(bob.sk)
  })
}

/**
 * Switch between signers for testing purposes
 */
function setSigner(secretKey: string) {
  Tezos.setProvider({
    rpc,
    signer: new InMemorySigner(secretKey)
  })
}

describe('Notarization flow', () => {
  let notary: TezosNotarySDK
  /**
   * Create a document from a hash without and with signees
   * to demonstrate that certain SDK functions can be
   * invoked without providing signees
   */
  const document: Document = Document.fromHash(hash)
  const documentWithSignees: Document = Document.fromHash(hash, signees)

  beforeAll(async done => {
    setSigner(alice.sk)
    notary = await TezosNotarySDKFactory.at(notaryAddress)
    done()
  })

  test('that the document is not notarized yet', async done => {
    const isNotarized: boolean = await notary.isNotarized(document)
    expect(isNotarized).toBeFalsy()
    done()
  })

  test('notarization of a new document', async done => {
    /**
     * Signees are only passed when notarizing the document for the first time
     */
    const notarizationOperation: TransactionOperation = await notary
      .notarize(documentWithSignees)
      .send()
    await notarizationOperation.confirmation(1)
    const isNotarized: boolean = await notary.isNotarized(document)
    expect(isNotarized).toBeTruthy()
    done()
  })

  test('that the document is not fully signed yet', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const isFullySigned: boolean = notarizedDocument.isFullySigned()
    expect(isFullySigned).toBeFalsy()
    done()
  })

  test('signing of the document by Alice', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const signingOperation: TransactionOperation = await notary.sign(notarizedDocument).send()
    console.log('Waiting for confirmation in next block, please be patient ...')
    await signingOperation.confirmation(1)
    const notarizedAndSignedDocument: NotarizedDocument = await notary.getDocument(document)
    expect(notarizedAndSignedDocument.signatures[alice.pkh]).toBeTruthy()
    done()
  })

  // duplicate test, but fits in the flow
  test('that the document is not fully signed yet', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const isFullySigned: boolean = notarizedDocument.isFullySigned()
    expect(isFullySigned).toBeFalsy()
    done()
  })

  test('signing of the document by Bob', async done => {
    setSigner(bob.sk)
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const signingOperation: TransactionOperation = await notary.sign(notarizedDocument).send()
    console.log('Waiting for confirmation in next block, please be patient ...')
    await signingOperation.confirmation(1)
    const notarizedAndSignedDocument: NotarizedDocument = await notary.getDocument(document)
    expect(notarizedAndSignedDocument.signatures[bob.pkh]).toBeTruthy()
    done()
  })

  test('that the document is fully signed', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const isFullySigned: boolean = notarizedDocument.isFullySigned()
    expect(isFullySigned).toBeTruthy()
    done()
  })

  test('that Charly cannot sign account', async done => {
    // send tez from Alice to Charly
    setSigner(alice.sk)
    const charly = {
      address: 'tz1h6QcawkNF9523f5ydEFvdKL7t3NbuEA6H',
      sk: 'edsk2mFcqSHpj7ndKMvNaUNRSqS2UZ1FMwUL1wFstHSHzvpXwCzu7S'
    }
    const transactionOperation = await Tezos.contract.transfer({ to: charly.address, amount: 100 })
    await transactionOperation.confirmation(1)

    // set Charly as signer
    setSigner(charly.sk)
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)

    await expect(notary.sign(notarizedDocument).send()).rejects.toEqual(
      expect.objectContaining({
        id: String(constants.rpcErrors.michelson.scriptRejected)
      })
    )
    done()
  })
})
