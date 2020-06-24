import React from 'react';
import { Document, NotarizedDocument, signees, signatures, notarizedSignatures } from 'tezos-notary-sdk';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './DocumentForm.scss';

interface State {
    document: Document | NotarizedDocument | undefined;
}
interface Props {
    document: Document | NotarizedDocument | undefined;
    isNotarized: boolean | undefined;
    isFullySigned: boolean | undefined;
    onNotarize: (document: Document | undefined) => void;
    onSign: (document: NotarizedDocument) => void;
}
/**
 * Responsible for displaying details of uploaded Documents, while also
 * displaying details of already notarized documents.
 * 
 * Provides Sign and Notarize actions for the user.
 */
export class DocumentForm extends React.Component<Props, State> {

    static getDerivedStateFromProps(props: Props, state: State) {
        return {
            document: props.document
        };
    }

    /**
     * Based on the notarization / signing status, deduct a document status.
     */
    get documentStatus(): string {
        return this.props.isNotarized
            ? (
                this.props.isFullySigned
                ? "Document is notarized and signatures are complete"
                : "Document is notarized, but has missing signatures"
            )
            : "Document has not yet been notarized"
    }

    /**
     * Cast a document to a NotarizedDocument
     */
    get notarizedDocument(): NotarizedDocument {
        return this.state.document as NotarizedDocument;
    }

    /**
     * Filter signees who have a truthy signature
     */
    get signeesWhoSignedAlready(): signees {
        const signatures: notarizedSignatures = this.notarizedDocument.signatures;
        return Object.keys(signatures)
            .filter(signee => signatures[signee] === true)
    }

    /**
     * Filter signees who have a falsey signature
     */
    get signeesWhoDidNotSignYet(): signees {
        const signatures: notarizedSignatures = this.notarizedDocument.signatures;
        return Object.keys(signatures)
            .filter(signee => signatures[signee] === false)
    }

    /**
     * Handle input from the 'signee' text input,
     * update the current document with the new signees
     * @param event 
     */
    handleSigneesChange(event: any) {
        const document: NotarizedDocument = this.state.document as NotarizedDocument;
        document.signees = event.target.value.split(',');
        this.setState({
            ...this.state,
            document
        })
    }

    render() {
        return ( this.state.document ? (
            <div>
                <Row className="document-form">

                    <Col xs={12}>
                        <Form>
                            {/* Document status */}
                            <Form.Group className="text-center">
                                <h3>{this.documentStatus}</h3>
                            </Form.Group>

                            {/* Document hash */}
                            <Form.Group controlId="documentHash">
                                <Form.Label>Hash</Form.Label>
                                <Form.Control disabled type="text" placeholder="Document hash" value={this.state.document.hash}/>
                                <Form.Text className="text-muted">
                                SHA-256 hash of the document you've uploaded previously
                                </Form.Text>
                            </Form.Group>

                            {/* Document signees */}
                            <Form.Group controlId="signees">
                                <Form.Label>Signees</Form.Label>
                                <Form.Control onChange={(e) => this.handleSigneesChange(e)} disabled={this.props.isNotarized} type="text" placeholder="Signees" value={this.state.document.signees.join(',')}/>
                                <Form.Text className="text-muted">
                                List of signees for the document separated by a comma `,`
                                </Form.Text>
                            </Form.Group>

                            {/* Display signees who have or who have not yet signed the document */}
                            {this.props.isNotarized && !this.props.isFullySigned ? (
                                <div>
                                    <Form.Group controlId="signees">
                                        <Form.Label>Already signed by</Form.Label>
                                        <Form.Control disabled={this.props.isNotarized} type="text" placeholder="Signees" value={this.signeesWhoSignedAlready.join(',')}/>
                                        <Form.Text className="text-muted">
                                        List of signees who have already signed the document
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="signees">
                                        <Form.Label>Not yet signed by</Form.Label>
                                        <Form.Control disabled={this.props.isNotarized} type="text" placeholder="Signees" value={this.signeesWhoDidNotSignYet.join(',')}/>
                                        <Form.Text className="text-muted">
                                        List of signees who have not yet signed the document
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            ) : null}
                        </Form>
                    </Col>

                    {/* Action buttons */}
                    <Col xs={12} className="d-flex justify-content-around">
                        { this.props.isNotarized && !this.props.isFullySigned ? (
                            /**
                             * Sign
                             */
                            <Button className="actionButton" variant="outline-primary" onClick={() => this.props.onSign(this.notarizedDocument)}>
                                Sign
                            </Button>
                        ) : (!this.props.isNotarized) ? (
                            /**
                             * Notarize
                             */
                            <Button className="actionButton" variant="outline-primary" onClick={() => this.props.onNotarize(this.props.document)}>
                                Notarize
                            </Button>
                        ) : null}
                    </Col>

                </Row>
            </div>
        ) : null)
    }
}