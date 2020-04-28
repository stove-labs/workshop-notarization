import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Dropzone from 'react-dropzone';
import './DocumentUpload.scss'
import uploadIcon from 'bootstrap-icons/icons/upload.svg';

import sha256 from 'crypto-js/sha256';

import { Document, NotarizedDocument } from 'tezos-notary-sdk';

export interface Props {
    onDocumentUpload: (document: Document | NotarizedDocument) => void,
}

/**
 * Responsible for accepting document uploads
 * and computing the appropriate SHA-256 hash from their contents.
 */
export class DocumentUpload extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    /**
     * When a document is uploaded, hash it's contents and propagate the hash upstream.
     * @param acceptedFiles
     */
    handleDocumentUpload(acceptedFiles: File[]) {
        const file: File = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const content: string = event.target?.result as string;
            const hash: string = sha256(content).toString();
            const document: Document = Document.fromHash(hash);
            this.props.onDocumentUpload(document);
        }
        reader.readAsText(file);
    }
    
    render() {
        return <Dropzone onDrop={acceptedFiles => this.handleDocumentUpload(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <div className="dropzone bg-light">
                    <Card {...getRootProps()}>
                        <Card.Body className="text-center d-flex align-items-center justify-content-center">
                            <input {...getInputProps()} />
                            <Row>

                                {/* Icon */}
                                <Col xs={12} className="text-center">
                                    <img className="upload-icon" src={uploadIcon}></img>
                                </Col>

                                {/* Explanatory text */}
                                <Col xs={12}>
                                    <small className="upload-text">
                                        Drag 'n' drop a file here <br/>
                                        to begin the notarization process
                                    </small>
                                </Col>

                            </Row>                
                        </Card.Body>
                    </Card>
                </div>
            )}
        </Dropzone>
    }
}

