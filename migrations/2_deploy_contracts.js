const SpiroAgreementManager = artifacts.require("SpiroAgreementManager");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(SpiroAgreementManager/*, { from: accounts[0] }*/);
}   