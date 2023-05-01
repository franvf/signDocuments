//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.18;

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract signDocs is Ownable {

    mapping(address => mapping(bytes32 => bool)) isDocSignedBy;
    mapping(address => mapping(bytes32 => bool)) isDocRescindedBy;
    mapping(bytes32 => bool) isDocRevoked;
    mapping(address => mapping(bytes32 => bytes32)) signedDocument;
    mapping(address => bool) registeredUsers;

    //events
    event userRegistered(address);
    event newDocumentSigned(address, bytes32);

    //registered user modifier
    modifier isRegisteredUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    function registerUser(address newUser) external onlyOwner {
        registeredUsers[newUser] = true;
        emit userRegistered(msg.sender);
    }

    function ownerSignsDocument(bytes32 documentHash, string memory signature) external onlyOwner {
        require(bytes(signature).length > 0, "Signature length must be larger than zero");
        require(!isDocSignedBy[msg.sender][documentHash], "Document signed previously");
        require(!isDocRescindedBy[msg.sender][documentHash], "Document rescinded");

        
        bytes32 documentSignedHash = keccak256(abi.encodePacked(documentHash, signature));  //Hashing the document and the signature
        signedDocument[msg.sender][documentHash] = documentSignedHash; //Store signed document
        isDocSignedBy[msg.sender][documentHash] = true; //Mark the original document as signed by the owner
    }

    //@audit-issue -> CHEK https://solidity-by-example.org/signature/
    function userSignsDocument(bytes32 documentHash, string memory signature) external isRegisteredUser { 
        require(bytes(signature).length > 0, "Signature length must be larger than zero");
        require(isDocSignedBy[owner()][documentHash], "Owner must sign the contract first");
        require(!isDocSignedBy[msg.sender][documentHash], "Document signed previously");

        bytes32 docToSign = signedDocument[msg.sender][documentHash]; //Get the document signed by the owner
        bytes32 documentHashed = keccak256(abi.encodePacked(docToSign, signature)); //Add the user signature to the
                                                                                     //document signed by the owner
        
        isDocSignedBy[msg.sender][documentHash] = true; //Mark the original document as signed by the user

        emit newDocumentSigned(msg.sender, documentHashed);
    }

    function getIfIsDocSignedBy(bytes32 documentHash, address user) external view returns(bool){
        return isDocSignedBy[user][documentHash];
    }

    function ownerRescindDocument(bytes32 documentHash) external onlyOwner {
        require(isDocSignedBy[owner()][documentHash], "Document not signed");
        isDocRescindedBy[msg.sender][documentHash] = true;
    }

    function userRescindDocument(bytes32 documentHash) external isRegisteredUser {
        require(isDocSignedBy[msg.sender][documentHash], "Document not signed");
        isDocRescindedBy[msg.sender][documentHash] = true;
    }

    function revokeDocument(bytes32 documentHash, address user) external onlyOwner {
        require(isDocRescindedBy[msg.sender][documentHash], "Document not rescinded by the owner");
        require(isDocRescindedBy[user][documentHash], "Document not rescinded by the user");

        isDocRevoked[documentHash] = true;
        isDocSignedBy[user][documentHash] = false;
        isDocSignedBy[msg.sender][documentHash] = false;
    }

}