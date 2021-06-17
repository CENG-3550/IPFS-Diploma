import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import Diploma from "../abis/Diploma.json"
import Console from "./Console";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Nav from "./Nav";



const ipfsClient = require("ipfs-http-client")
const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: "https"});

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
  }


  constructor(props) {
    super(props);
    this.state = {
      account: "",
      buffer: null,
      contract: null,
      diplomaHash: ""
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  render() {
    return (
      <div>
            <Router>
              <div className="App">
              <Switch>
              
              <Route path="/" component={Console}/>
              < /Switch>
              </div>
            </Router>

      </div>
    );
  }
}

export default App;
