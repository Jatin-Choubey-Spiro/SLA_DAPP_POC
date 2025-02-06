// test/testSpiroAgreementManager.js
const SpiroAgreementManager = artifacts.require("SpiroAgreementManager");

contract("SpiroAgreementManager", (accounts) => {
  it("should create an agreement", async () => {
    const instance = await SpiroAgreementManager.deployed();
    await instance.createAgreement("hash1", "cid1", accounts[1], "Vendor1", { from: accounts[0] });

    const agreement = await instance.viewAgreement(0);
    assert.equal(agreement.vendor, accounts[1], "Vendor address does not match");
  });

  it("should create a sub-agreement", async () => {
    const instance = await SpiroAgreementManager.deployed();
    await instance.createSubAgreement(0, "subHash1", "subCid1", accounts[2], "SubVendor1", { from: accounts[1] });

    const subAgreement = await instance.viewSubAgreement(0, 0);
    assert.equal(subAgreement.subVendor, accounts[2], "Sub-vendor address does not match");
  });

  it("should sign an agreement", async () => {
    const instance = await SpiroAgreementManager.deployed();
    await instance.signAgreement(0, { from: accounts[0] });
    await instance.signAgreement(0, { from: accounts[1] });

    const agreement = await instance.viewAgreement(0);
    assert.equal(agreement.isComplete, true, "Agreement is not complete");
  });

  it("should sign a sub-agreement", async () => {
    const instance = await SpiroAgreementManager.deployed();
    await instance.signSubAgreement(0, 0, { from: accounts[1] });
    await instance.signSubAgreement(0, 0, { from: accounts[2] });

    const subAgreement = await instance.viewSubAgreement(0, 0);
    assert.equal(subAgreement.isComplete, true, "Sub-agreement is not complete");
  });
});