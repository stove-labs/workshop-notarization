import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './config';
import { Notary } from "./containers/Notary";

class App extends React.Component {

  render() {
    return <Notary/>
  }
}

export default App;
