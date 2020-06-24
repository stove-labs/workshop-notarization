import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

interface Props {
  pkh: string | undefined;
  connected: boolean;
  thanosWalletAvailable: boolean;
  onConnectButton: () => void;
  onPermissionRequestButton: () => void;
}

export class WalletConnector extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Thanos Wallet not available</Popover.Title>
        <Popover.Content>
          After installation make sure to enable <strong>DApps</strong> in
          settings.
        </Popover.Content>
      </Popover>
    );
    let changeAccountButton = (
      <Button
        type="button"
        variant="outline-primary"
        onClick={() => this.props.onConnectButton()}
      >
        Change account
      </Button>
    );
    let connectPermissionButtonActive = (
      <Button
        type="button"
        variant="outline-primary"
        onClick={() => this.props.onPermissionRequestButton()}
      >
        Connect
      </Button>
    );
    let connectPermissionButtonDeactivated = (
      <OverlayTrigger overlay={popover} placement="right">
        <span className="d-inline-block">
          <Button
            type="button"
            disabled
            style={{ pointerEvents: "none" }}
            variant="outline-primary"
            onClick={() => this.props.onPermissionRequestButton()}
          >
            Connect
          </Button>
        </span>
      </OverlayTrigger>
    );
    let connectButton = this.props.thanosWalletAvailable
      ? connectPermissionButtonActive
      : connectPermissionButtonDeactivated;
    let walletButton = this.props.connected
      ? changeAccountButton
      : connectButton;
    return (
      <Col xs={12} md={8}>
        <Card bg="light">
          <Card.Header>
            <Row>
              <Col xs={4}>Connected Account</Col>
              <Col xs={8} className="text-right notary-address">
                {this.props.pkh}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="justify-content-md-center">{walletButton}</Row>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}
