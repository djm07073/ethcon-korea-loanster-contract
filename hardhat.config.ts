import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
dotenv.config();

const DEPLOY = process.env.DEPLOY!;

const POLYGONSCAN = process.env.POLYSCAN_API_KEY!;
const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};
const VIA_IR_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    viaIR: true,
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};
const DEFAULT_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 4_000_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};
export default {
  networks: {
    hardhat: {
      forking: {
        url: "https://bsc.publicnode.com",
        blockNumber: 30931586,
      },
    },
    // hardhat: {
    //   forking: {
    //     url: "https://rpc.ankr.com/eth",
    //     blockNumber: 17932695,
    //   },
    // },ethereum
    // hardhat: {
    //   forking: {
    //     url: "https://rpc.ankr.com/eth_goerli",
    //     blockNumber: 9588886,
    //   },
    // },

    baobab: {
      url: "https://api.baobab.klaytn.net:8651",
      accounts: [DEPLOY],
    },
    zksync: {
      chainId: 324,
      url: "https://mainnet.era.zksync.io",
      accounts: [DEPLOY],
    },
    ethereum: {
      chainId: 1,
      url: "https://eth.llamarpc.com",
      accounts: [DEPLOY],
      gasPrice: 16 * 10 ** 9,
    },
    bsc: {
      chainId: 56,
      url: "https://bsc.blockpi.network/v1/rpc/public",
      accounts: [DEPLOY],
    },
    polygon: {
      chainId: 137,
      url: "https://polygon.llamarpc.com",
      accounts: [DEPLOY],
    },
    goerli: {
      chainId: 5,
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [DEPLOY],
      gasPrice: 1.5 * 10 ** 9,
    },
    matic: {
      chainId: 137,
      url: "https://polygon.llamarpc.com",
      accounts: [DEPLOY],
      gasPrice: 80 * 10 ** 9,
    },
    mumbai: {
      chainId: 80001,
      url: "https://polygon-mumbai-bor.publicnode.com",
      accounts: [DEPLOY],
      gasPrice: 300 * 10 ** 9,
    },
    tbsc: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s2.binance.org:8545",
      accounts: [DEPLOY],
      gasPrice: 7 * 10 ** 9,
    },
    chiado: {
      chainId: 10200,
      url: "https://rpc.chiadochain.net",
      accounts: [DEPLOY],
      gasPrice: 1000000000,
    },
    sepolia: {
      chainId: 11155111,
      url: "https://rpc.sepolia.org",
      accounts: [DEPLOY],
    },
    base: {
      chainId: 8453,
      url: "https://base.meowrpc.com",
      accounts: [DEPLOY],
    },

    optimism: {
      chainId: 10,
      url: "https://api.zan.top/node/v1/opt/mainnet/public",
      accounts: [DEPLOY],
    },
    arbitrum: {
      chainId: 42161,
      url: "https://arbitrum.meowrpc.com",
      accounts: [DEPLOY],
    },
  },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        // do not include the metadata hash, since this is machine dependent
        // and we want all generated code to be deterministic
        // https://docs.soliditylang.org/en/v0.7.6/metadata.html
        bytecodeHash: "none",
      },
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN,
  },
};
