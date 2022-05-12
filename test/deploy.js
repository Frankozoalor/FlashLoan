const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle, artifacts } = require("hardhat");
const hre = require("hardhat");

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");

describe("Deploy a flash Loan ", function() {
    it("Should take a flash loan and able to return it", async function () {
        const flashLoan = await ethers.getContractFactory("FlashLoan");
        const _flashLoan = await flashLoan.deploy(
            //Address of the PoolAddressProvider
            POOL_ADDRESS_PROVIDER
        );
        await _flashLoan.deployed();
        const token = await ethers.getContractAt("IERC20", DAI);
        const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");

        //Impersonating the DAI_WHALE account to be able to send transaction 
        //from that account
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI_WHALE]
        });
        const signer = await ethers.getSigner(DAI_WHALE);
        //sending our contract 2000 DAI from the DAI_WHALE
        await token.connect(signer).transfer(_flashLoan.address, BALANCE_AMOUNT_DAI);
        //Borrowing 1000 DAI in a flash Loan with no upfront collateral
        const tx = await _flashLoan.createFlashLoan(DAI, 1000); 
        await tx.wait()
        //Checking the balance of DAI in the flash loan contract afterwards
        const remainingBalance = await token.balanceOf(_flashLoan.address);
        // We must have less than 2000 DAI now, since the premium was paid from our contract's balance
        expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true;
    });
});