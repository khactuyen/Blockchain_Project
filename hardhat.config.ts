import { createRequire } from "node:module";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  solidity: {
    version: "0.8.24",
    path: require.resolve("solc/soljson.js"),
    settings: {
      evmVersion: "paris",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    ganache: {
      type: "http",
      url: process.env.GANACHE_RPC_URL ?? "http://127.0.0.1:7545",
      chainId: Number(process.env.GANACHE_CHAIN_ID ?? "1337"),
      accounts: "remote",
    },
  },
});
