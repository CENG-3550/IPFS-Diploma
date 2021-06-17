import React, { Component } from 'react';
import Web3 from "web3";
import './Console.css';
import Diploma from "../abis/Diploma.json"
import "./App";

const ipfsClient = require("ipfs-http-client")
const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: "https"});

class Console extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.getDiplomas()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Diploma.networks[networkId]
    if(networkData){
      const abi = Diploma.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({contract})
    } else{
      window.alert("Smart contract not deployed to detect network!")
      }
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


  async getDiplomas(){
    const DiplomaCount = await this.state.contract.methods.getDiplomaCount().call()
    var gett = await this.state.contract.methods.getTdip().call()
    console.log(gett)
    const x = document.querySelector(".container")
    for (var i = 0; i < DiplomaCount; i++){
      const newdiv = document.createElement("div");
      newdiv.classList.add("row")
      newdiv.classList.add("small")
      newdiv.classList.add("files-row")
      const newnewdiv = document.createElement("div")
      newnewdiv.classList.add("col")
      newnewdiv.classList.add("rounded")
      newnewdiv.classList.add("p-3")
      newnewdiv.classList.add("mb-5")
      newnewdiv.classList.add("shadow")
      newnewdiv.classList.add("bg-white")
      newdiv.appendChild(newnewdiv)
      const rowdiv = document.createElement("div")
      rowdiv.classList.add("row")
      newnewdiv.appendChild(rowdiv)
      const typediv = document.createElement("div")
      typediv.classList.add("col")
      const namediv = document.createElement("div")
      namediv.classList.add("col")
      const hashdiv = document.createElement("div")
      hashdiv.classList.add("col-7")
      const linkdiv = document.createElement("div")
      linkdiv.classList.add("col")
      const linkadiv = document.createElement("a")
      const hashdata = gett[i][1]
      const name = gett[i][2]
      const type = gett[i][3]
      linkadiv.href = "https://ipfs.io/ipfs/"+ hashdata
      linkadiv.innerText ="Click!"
      hashdiv.innerText = hashdata
      typediv.innerText = type
      namediv.innerText = name
      rowdiv.appendChild(typediv)
      rowdiv.appendChild(namediv)
      rowdiv.appendChild(hashdiv)
      rowdiv.appendChild(linkdiv)
      linkdiv.appendChild(linkadiv)
      x.appendChild(newdiv)
    }
  }


  captureFile = (event) => {
    event.preventDefault()
    console.log("file captured.")
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer.from(reader.result)})
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    const diplomaName = document.querySelector(".input-fileName").value
    const diplomaStudenID = document.querySelector(".input-diplomaStudenID").value
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      const diplomaHash = result[0].hash
      this.setState({diplomaHash})
      if(error) {
        console.error(error)
        return
      }
      
      this.state.contract.methods.createDiploma(diplomaHash,diplomaName,diplomaStudenID).send({from: this.state.account}).on("confirmation",(r) =>{
        this.setState({diplomaHash})
        window.location.reload()
      })
    })
  }

  render() {
    const { data } = this.props.location
    return (

      <div className = "bg-light main">

            <nav className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
            <div className="auto">
              <a
                className="navbar-brand col-sm-3 col-md-2 text-white"
                href="http://localhost:3000/console"
                rel="noopener noreferrer"
              >
              DIPLOMA
              </a>
              </div>
            </nav>

            <div className="auto">
              <div className= "container">
                <div className ="row">
                  <div className="col rounded shadow p-3 mb-5 bg-white col-first">
                    <div className="row">
                      <div className="col">Diploma</div>
                      <div className="col small"><span className="float-right">IPFS Version: <span className="font-italic">0.8.0</span></span></div>
                    </div>
                    <div className="row">
                      <div className="col"><span className="small">Account: <span>{this.state.account}</span></span></div>
                    </div>
                    
                  </div>
                  
                
                  <div className="col rounded shadow p-3 mb-5 bg-white small">
                    <form onSubmit={this.onSubmit}>
                      <label class="form-label"for="fname">Student Number</label>
                      <input type="text" class="float input-diplomaStudenID" name="fname"/><br/>

                      <label class="form-label"for="fname">Diploma Name:</label>
                      <input type="text" class="float input-fileName" name="fname"/><br/>
                      <label for="lname">Choose File:</label>
                      <input type="file" class="p-3" onChange={this.captureFile}/><br/>
                      <input type="submit" class="float p-1 d-inline-block"/>
                    </form>
                  </div>
                </div>
                <div className ="row files">
                  <div className="col rounded p-3 mb-5 shadow bg-white">
                    <div className="h3 float-left">Files</div>
                    <div className="float-right">
                      <input type="text" class="float-right" name="fname"/></div>
                    </div>
                </div>
                <div className ="row files-title">
                  <div className="col rounded p-3 mb-5 shadow bg-white">
                    <div class="row ">
                      <div class="col">
                        <div className="border-bottom">Student ID</div>
                      </div>
                      <div class="col">
                        <div className="border-bottom">Name</div>
                      </div>
                      <div class="col-7">
                        <div className="border-bottom">Hash</div>
                      </div>
                      <div class="col">
                        <div className="border-bottom">Link</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
      </div>
    );
  }
}

export default Console;
