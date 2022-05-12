//SPDX-License-Identifier: MIT

    pragma solidity ^0.8.4;

    import "@openzeppelin/contracts/utils/math/SafeMath.sol";
    import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

     contract FlashLoan is FlashLoanSimpleReceiverBase{
        using SafeMath for uint;
        event log(address asset, uint val);

        //FlashLoanSimpleRecieverBase is a contract from Aave from openzeppelin which 
        // we use to setup our contract as the reciever for the flash loan.

        constructor(IPoolAddressesProvider provider)
        public FlashLoanSimpleReceiverBase(provider)
        {}

        function createFlashLoan(address asset, uint amount) external{
            address reciever = address(this);
            bytes memory params = ""; // This will be used to pass arbitary data to executeOperation
            uint16 referralCode = 0;

            POOL.flashLoanSimple(
                reciever,
                asset,
                amount,
                params,
                referralCode
            );
        }

        function executeOperation(
            address asset,
            uint256 amount,
            uint256 premium,
            address initiator,
            bytes calldata params
        ) external returns (bool){
            //Do things  like arbitrage here
            //abi.encode(params) to decode params
            uint amountOwing = amount.add(premium);
            IERC20(asset).approve(address(POOL), amountOwing);
            emit log(asset, amountOwing);
            return true;
        }
    }
