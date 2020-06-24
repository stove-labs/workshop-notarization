import { Tezos, TransactionWalletOperation } from '@taquito/taquito'
import { InMemorySigner, importKey } from '@taquito/signer'
import { TezosNotarySDK, TezosNotarySDKFactory, Document } from '../src/tezos-notary-sdk'
import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation'
import { NotarizedDocument } from '../src/notarizedDocument'
import { constants } from '../helpers/constants'
import { faucet } from '../helpers/faucet'

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
const hash = '36d87a683cfb033dcdb751723d5ef32085988716ce87a30c4ee3844992510a6'
/**
 * Signees for notarization of the document hash above
 */
const signees = [alice.pkh, bob.pkh]

/**
 * Switch between signers for testing purposes
 */
function setSigner(secretKey: string) {
  Tezos.setProvider({
    rpc
  })
  importKey(Tezos, secretKey)
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

  test.only('that the document is not notarized yet', async done => {
    const isNotarized: boolean = await notary.isNotarized(document)
    expect(isNotarized).toBeFalsy()
    done()
  })

  test('notarization of a new document', async done => {
    /**
     * Signees are only passed when notarizing the document for the first time
     */
    const notarizationOperation: TransactionWalletOperation = await notary
      .notarize(documentWithSignees)
      .send()
    await notarizationOperation.confirmation(1)
    const isNotarized: boolean = await notary.isNotarized(document)
    expect(isNotarized).toBeTruthy()
    done()
  })

  test('notarization of an existing document is not possible', async done => {
    /**
     * Signees are only passed when notarizing the document for the first time
     */
    await expect(notary.notarize(documentWithSignees).send()).rejects.toEqual(
      expect.objectContaining({
        message: String(constants.contractErrors.documentHashAlreadyNotarized)
      })
    )
    done()
  })

  test('that the document is not fully signed yet', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const isFullySigned: boolean = notarizedDocument.isFullySigned()
    expect(isFullySigned).toBeFalsy()
    done()
  })

  test('that Alice should not be able to sign a document that was not notarized', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    // manipulate to non-existing document
    notarizedDocument.hash = 'corrupt'
    await expect(notary.sign(notarizedDocument).send()).rejects.toEqual(
      expect.objectContaining({
        message: String(constants.contractErrors.documentNotFound)
      })
    )
    done()
  })

  test('that Alice should be able to sign document', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const signingOperation: TransactionWalletOperation = await notary.sign(notarizedDocument).send()
    console.log('Waiting for confirmation in next block, please be patient ...')
    await signingOperation.confirmation(1)
    const notarizedAndSignedDocument: NotarizedDocument = await notary.getDocument(document)
    expect(notarizedAndSignedDocument.signatures[alice.pkh]).toBeTruthy()
    done()
  })

  test('that Alice cannot sign a document that already signed by her', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    await expect(notary.sign(notarizedDocument).send()).rejects.toEqual(
      expect.objectContaining({
        message: String(constants.contractErrors.documentAlreadySigned)
      })
    )
    done()
  })

  // duplicate test, but fits in the flow
  test('that the document is not fully signed yet', async done => {
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const isFullySigned: boolean = notarizedDocument.isFullySigned()
    expect(isFullySigned).toBeFalsy()
    done()
  })

  test('that Bob should be able to sign document', async done => {
    setSigner(bob.sk)
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    const signingOperation: TransactionWalletOperation = await notary.sign(notarizedDocument).send()
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

  test('that Chuck should not be able to sign the document', async done => {
    const chuck = {
      pkh: 'tz1h6QcawkNF9523f5ydEFvdKL7t3NbuEA6H',
      sk: 'edsk2mFcqSHpj7ndKMvNaUNRSqS2UZ1FMwUL1wFstHSHzvpXwCzu7S'
    }
    // fund Chuck's account
    await faucet.drip(chuck.pkh, 10)
    // set Chuck as signer
    setSigner(chuck.sk)
    const notarizedDocument: NotarizedDocument = await notary.getDocument(document)
    await expect(notary.sign(notarizedDocument).send()).rejects.toEqual(
      expect.objectContaining({
        message: String(constants.contractErrors.senderIsNotASigneeForThisDocument)
      })
    )
    done()
  })
})
