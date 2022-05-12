require("@nomiclabs/hardhat-waffle");
require("dotenv").config({Path: ".env"});

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: ALCHEMY_API_KEY_URL
      },
    },
  },
};
