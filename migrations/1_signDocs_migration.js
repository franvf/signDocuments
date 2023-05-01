const signDocs = artifacts.require("signDocs");

module.exports = function (deployer) {
  deployer.deploy(signDocs);
};
