import React from "react";
import "./Notary.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import { DocumentUpload } from "./../components/DocumentUpload";
import { DocumentForm } from "./../components/DocumentForm";
import { WalletConnector } from "./../components/WalletConnector";
import { Tezos, TransactionWalletOperation } from "@taquito/taquito";
import {
  Document,
  TezosNotarySDK,
  TezosNotarySDKFactory,
} from "tezos-notary-sdk";
import { notaryAddress, rpc } from "./../config";
import { NotarizedDocument } from "tezos-notary-sdk/dist/types/notarizedDocument";
import { ThanosWallet } from "@thanos-wallet/dapp";

type Props = any;
interface State {
  document: Document | NotarizedDocument | undefined;
  isNotarized: boolean | undefined;
  isFullySigned: boolean | undefined;
  loading: boolean;
  pkh: string | undefined;
  connected: boolean;
  thanosWalletAvailable: boolean;
}
export class Notary extends React.Component<Props, State> {
  /**
   * Instance of the Notary SDK
   */
  public notary?: TezosNotarySDK;
  public wallet?: ThanosWallet;

  constructor(props: Props) {
    super(props);
    this.state = {
      document: undefined,
      isNotarized: false,
      isFullySigned: false,
      loading: false,
      pkh: undefined,
      connected: false,
      thanosWalletAvailable: false,
    };
  }

  /**
   * Create an instance of the Notary SDK when the component is mounting
   */
  async componentWillMount() {
    // Check whether Thanos Wallet is available
    const available = await ThanosWallet.isAvailable();
    this.setState({ thanosWalletAvailable: available });
    // Initialize the wallet SDK on DApp side
    this.wallet = new ThanosWallet("new dapp");
    // Set wallet was provider for the Taquito SDK
    Tezos.setProvider({ wallet: this.wallet, rpc: rpc });
    const connected = this.wallet.connected;
    // Save which account address is connected
    const pkh = await this.wallet.getPKH();
    this.setState({ pkh: pkh, connected: connected });
  }

  /**
   * Display the progress bar
   */
  startLoading() {
    this.setState({
      ...this.state,
      loading: true,
    });
  }

  /**
   * Hide the progress bar
   */
  stopLoading() {
    this.setState({
      ...this.state,
      loading: false,
    });
  }

  /**
   * When a document is selected via the upload form,
   * check if it has been already notarized & signed
   * @param uploadedDocument
   */
  async handleDocumentUpload(uploadedDocument: Document) {
    // start loading
    this.startLoading();
    // check if the document has been notarized
    var isNotarized = await this.notary?.isNotarized(uploadedDocument);
    let document: Document | NotarizedDocument | undefined = uploadedDocument;
    let isFullySigned: boolean = false;
    // fetch the notarized document and it's signature status
    if (isNotarized) {
      document = await this.notary?.getDocument(uploadedDocument);
      isFullySigned = await (document as NotarizedDocument).isFullySigned();
    }

    this.setState({ document, isNotarized, isFullySigned });
    this.stopLoading();
  }

  /**
   * When a document is selected for signing, send the signing operation
   * and wait for it to be included/confirmed. Afterwards refresh the Notary state for the given document.
   * @param notarizedDocument
   */
  async handleDocumentSign(notarizedDocument: NotarizedDocument) {
    this.startLoading();
    const signingOperation: TransactionWalletOperation = await this.notary!.sign(
      notarizedDocument
    ).send();
    await signingOperation.confirmation(1);
    await this.handleDocumentUpload(notarizedDocument);
    this.stopLoading();
  }

  /**
   * When a document is selected for notarization, with the signees provided, send the notarization
   * operation and wait for it to be included/confirmed.
   * @param document
   */
  async handleDocumentNotarization(document: Document | undefined) {
    this.startLoading();
    const notarizationOperation: TransactionWalletOperation = await this.notary!.notarize(
      document as Document
    ).send();
    await notarizationOperation.confirmation(1);
    await this.handleDocumentUpload(document as Document);
    this.stopLoading();
  }
  /**
   * The user can change the account that is connected to the DApp by forcing permission change.
   */
  async handleNewConnect() {
    await this.wallet!.connect("sandbox", { forcePermission: true });
    const pkh = await this.wallet!.getPKH();
    this.setState({ pkh: pkh });
  }
  /**
   * The DApp needs to be connected to the Thanos Wallet browser extension to initialize the SDK.
   */
  async handleConnectPermission() {
    await this.wallet!.connect("sandbox");
    const connected = this.wallet!.connected;
    this.setState({ connected: connected });
    console.log("connected " + connected);
    const pkh = await this.wallet!.getPKH();
    this.setState({ pkh: pkh });
    this.notary = await TezosNotarySDKFactory.at(notaryAddress, Tezos);
  }

  render() {
    return (
      <Container className="notary">
        <Row className="justify-content-md-center">
          <WalletConnector
            pkh={this.state.pkh}
            connected={this.state.connected}
            thanosWalletAvailable={this.state.thanosWalletAvailable}
            onConnectButton={() => this.handleNewConnect()}
            onPermissionRequestButton={() => this.handleConnectPermission()}
          ></WalletConnector>
          <Col xs={12} md={8}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={4}>Stove Labs' Notary</Col>
                  <Col xs={8} className="text-right notary-address">
                    {notaryAddress}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {/* Progress bar */}
                {this.state.loading ? (
                  <ProgressBar
                    className="progress-bar"
                    animated
                    now={100}
                    label={"Loading"}
                  />
                ) : null}

                {/* Document upload form */}
                <DocumentUpload
                  onDocumentUpload={(document) =>
                    this.handleDocumentUpload(document)
                  }
                ></DocumentUpload>

                {/* Document details form, with signees input and action buttons */}
                <DocumentForm
                  isFullySigned={this.state.isFullySigned}
                  isNotarized={this.state.isNotarized}
                  document={this.state.document}
                  onSign={(document) => this.handleDocumentSign(document)}
                  onNotarize={(document) =>
                    this.handleDocumentNotarization(document)
                  }
                ></DocumentForm>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
