## Project overview
This project shows a way to sign traditional contracts via blockchain and store the signature and the hash of the signed contract on the blockchain. This is a proof of concept, so more functionalities could be added in order to improve the smart contract security and reliability.

## Installation

1. Clone the repository in your machine: You can use the git console and simply write the command `git clone https://github.com/franvf/signDocuments.git.` Alternatively, you can download and extract the project zip file on your machine.

2. Install all the dependencies: In order to make our project work, we need to install all the packages and libraries our project is 
using. To do this, we can simply open the terminal, go to the directory project and write the command `npm i`. Now all the required packages 
will be installed. 

3. Install Ganache and Truffle: If you don't have this software installed yet, it is time to install it. You can download the Ganache GUI installer from [here](https://trufflesuite.com/ganache/). And to install Truffle, you can follow [this](https://trufflesuite.com/docs/truffle/how-to/install/) guide.

4. Test the project: In order to check if the environment is ready, we can start the ganache GUI and then open the terminal and go to the project directory. Then we must execute the command `truffle migrate` to deploy the smart contracts of both collections in our local blockchain. When deployment finishes, we can return to our terminal and execute the test file. This can be done by executing the `truffle test` command in the project directory. Now the JS file in the *test* directory will be executed, and if all is correct, the test will pass.

## Use case
First of all, the contract owner (for example, an agency or other kind of entity) registers the user who will be able to sign a document. This can be done from the admin panel in the APP GUI. Then the owner can upload the contract and hash it. After this, the owner is able to sign the document using his/her blockchain account (or the wallet). Once the owner signs the document, the user will be able to sign the document doing the same steps but from the Main panel. Once the document is signed by both (the entity and user), the blockchain will prove that the document is signed.
Additionally, the user will be able to check whether a contract is valid. This can be done by hashing the document, passing our address in the *user address* field, and pressing the button *check signature*. The app should return if the contract is still valid or not.
Suppose some of the parts want to rescind the contract. In that case, they can do it by uploading the contract they want to rescind, hashing it, and pressing the button *rescind document* (this button is in the main panel in the case of the normal user and also in the admin panel for the owner). The contract will be valid until both parties rescind the contract and the owner finally revokes it. 