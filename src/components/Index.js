import React, {Component} from 'react';
import Web3 from 'web3';
import {ethers} from 'ethers';
import sha256 from 'crypto-js/sha256';
import contract from '../abis/signDocs.json'

class index extends Component {

    //Load metamask and SC data when the application starts
    async componentDidMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    //Load metamask 
    async loadWeb3(){
        if(window.ethereum){ //If metamask exist in the current browser
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.request({method: 'eth_requestAccounts'})
        } else if(window.web3){
            window.web3 = Web3(window.web3.currentProvider)
        } else {
            window.alert("No metamask wallet available")
        }
    }

    //Get the SC from the network
    async loadBlockchainData(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({currentAccount: accounts[0]})
        const networkId = 5777 //Local blockchain id
        const networkData = contract.networks[networkId]
        if(networkData){
            const abi = contract.abi 
            const address = networkData.address
            const currentContract = new web3.eth.Contract(abi, address)
            this.setState({contract: currentContract})
            this.setState({contractAddress: currentContract._address})
        } else {
            window.alert("No smart contract deployed")
        }
    }

    constructor(props){
        super(props)
        this.state = {
            currentAccount: '',
            contract: null,
            contractAddress: '',
            file: null,
            fileHash: '',
            signature: ''
        }
    }

    onChange(e){
        let file = e.target.files;
        this.setState({file: file[0]})
     }
    
    //Function to get the hash of the original document
    hashTheFile = async() => {

        const fr = new FileReader()

        fr.readAsText(this.state.file)

        fr.addEventListener("loadend", (evt) => {
            if(evt.target.readyState == fr.DONE) {
                let hash = sha256(fr.result).toString()
                hash = hash.substring(0,31) //Get first 32 characters of the string (32 bytes)
                console.log("Hash: ", hash)
                hash = ethers.utils.formatBytes32String(hash) //Convert the str hash to bytes32
                this.setState({fileHash: hash}) //Store the bytes32 hash in the sate
                console.log("The hash: ", this.state.fileHash)
                window.alert("Contract hashed succesfully")
            }
        })
    }

    // Upload hash of the traditional contract to the blockchain
    userSignsDocument = async() => {
        try {
            const currentSignature = await this.signContract()
            console.log("Sign: " + currentSignature)
            
            await this.state.contract.methods.userSignsDocument(this.state.fileHash, currentSignature).send({from: this.state.currentAccount})
            window.alert("Transaction to sign the document initiated")
        } catch(err){
            console.log(err)
        }
    }

    getIfIsDocSignedBy = async(userAddress) => {    
        try {
            const check = await this.state.contract.methods.getIfIsDocSignedBy(this.state.fileHash, userAddress).call({from: this.state.currentAccount})
            if(check){
                window.alert("Contract still valid")
            } else {
                window.alert("Contract not signed or revoked")
            }
        } catch(err) {
            console.log(err)
        }
    }

    userRescindDocument = async() => {
        try {
            await this.state.contract.methods.userRescindDocument(this.state.fileHash).send({from: this.state.currentAccount})
        } catch(err){
            console.log(err)
        }
    }

    signContract = async() => { //Sign the document using the wallet
        const message = this.state.fileHash //Get the hash of the document
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const signature = await signer.signMessage(message)

        const verification = ethers.utils.verifyMessage(message, signature) //Get public key from message and signature
        console.log("Signer: ", verification)

        return signature
    }

    //Front-end
    render(){
        return(
            <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
              <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                DApp
              </a>
              <ul className="navbar-nav px-3"> 
                <li className = "nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <small className="text-red"> 
                    <span id="account">{this.state.address} </span>
                  </small>
                </li>
              </ul>
            </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <div onSubmit={this.onFormSubmit}>
                            <input type="file" name='file' onChange={e => this.onChange(e)} />                            
                        </div>
                        <br></br> <br></br>
                        <div className='w-1/2 flex flex-col pb-12'>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                this.hashTheFile()
                            }}>
                                <input type="submit"
                                    className='bbtn btn-block btn-danger btn-sm'
                                    value="Hash the file"/>
                            </form>
                        </div>
                        <br></br> <br></br>
                        <div className='w-1/2 flex flex-col pb-12'>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                this.userSignsDocument()
                            }}>
                                <input type="submit"
                                    className='bbtn btn-block btn-warning btn-sm'
                                    value="Sign document"/>
                            </form>
                        </div>
                        <br></br> <br></br>
                        <div className='w-1/2 flex flex-col pb-12'>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                this.userRescindDocument()
                            }}>
                                <input type="submit"
                                    className='bbtn btn-block btn-warning btn-sm'
                                    value="Rescind document"/>
                            </form>
                        </div>
                        <br></br> <br></br>
                        <div className='w-1/2 flex flex-col pb-12'>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                const address = this.address.value
                                this.getIfIsDocSignedBy(address)
                    }}>

                        <input type="textarea"
                            className="form-control mb-1"
                            placeholder="user address"
                            ref={(input) => this.address = input} />

                        <input type="submit"
                            className='bbtn btn-block btn-danger btn-sm'
                            value="Check signature" />
                    </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default index;