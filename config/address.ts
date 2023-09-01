import { ZeroAddress } from "ethers";

export const BLOCK_TIMES = {
  1: 12.5, // ethereum
  5: 15,
  10: 2,
  137: 2.2, // polygon
  56: 3, // bsc
  97: 3, // bsct
  8453: 2,
  42161: 0.3, // arbitrum
  80001: 5, // mumbai
};

export const CONFIGS = {
  // includedChains: [1, 5, 137, 56, 42161],
  goerli: {
    chainId: 5,
    blockTime: BLOCK_TIMES[5],
    uniswapV3: {
      chainId: 5,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      factoryV2: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      subgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      wETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      meta: {
        tickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
        quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
        swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
      },
    },
    pancakeswapV3: { meta: {} },
    sushiswap: { meta: {} },
    token: {
      WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      USDC: "0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620",
      USDT: "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951",
      TOAST: "0xF7339F85c21ea765076796f0adb8888782bA3cc8",
    },
    mintableToken: {
      USDC: "0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620",
      USDT: "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951",
      TOAST: "0xF7339F85c21ea765076796f0adb8888782bA3cc8",
    },
    pair: {
      "USDC-USDT": {
        tokens: [
          "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951",
          "0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620",
        ],

        POOL: "0x6b04be67Ed18aB195141ee3033e60Dd9E2eB90F8",
      },
      "USDC-WETH": {
        tokens: [
          "0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620",
          "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        ],
        POOL: "0x207662844a235b383375C199c5CA35900DB5ca39",
      },
      "USDT-WETH": {
        tokens: [
          "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951",
          "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        ],
        POOL: "0xdC795167080b542D110CE3a570AB7818A757e538",
      },
      "TOAST-WETH": {
        tokens: [
          "0xF7339F85c21ea765076796f0adb8888782bA3cc8",
          "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        ],
        POOL: "0xbdCC75934720a465F99a28a1D098742E4de53f46",
      },
      "TOAST-USDC": {
        tokens: [
          "0xF7339F85c21ea765076796f0adb8888782bA3cc8",
          "0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620",
        ],
        POOL: "0x1273F2C07Fbe6b314BBc1698210c4C385A968F54",
      },
      "TOAST-USDT": {
        tokens: [
          "0xF7339F85c21ea765076796f0adb8888782bA3cc8",
          "0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951",
        ],
        POOL: "0x8aA35e2C018b2865D77Dd6De37f8269C3ea2C742",
      },
    },
  },
  mumbai: {
    chainId: 80001,
    blockTime: BLOCK_TIMES[80001],
    uniswapV3: {
      chainId: 80001,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      subgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      wETH: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      meta: {
        tickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
        quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
        swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7",
      },
    },
    pancakeswapV3: { meta: {} },
    sushiswap: { meta: {} },
    token: {
      WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      USDT: "0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0",
      USDC: "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7",
      TOAST: "0x8B3026aa2daAE85C2180eC0b5b9e17496a747cDB",
    },
    mintableToken: {
      USDT: "0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0",
      USDC: "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7",
      TOAST: "0x8B3026aa2daAE85C2180eC0b5b9e17496a747cDB",
    },
    pair: {
      "USDC-WMATIC": {
        tokens: [
          "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7",
          "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        ],
        POOL: "0xF2A6b9Abe6f0e5969C75da15c178322b9F30DFe7",
      },
      "USDT-WMATIC": {
        tokens: [
          "0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0",
          "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
        ],
        POOL: "0xA12b9F45ce47be62C6340ca3CF49B3Ec8fCf772b",
      },
      "USDT-USDC": {
        tokens: [
          "0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0",
          "0x742dfa5aa70a8212857966d491d67b09ce7d6ec7",
        ],
        POOL: "0x97eddb49E3920e15B1515fe2D588502955A9AA46",
      },
      "USDC-TOAST": {
        tokens: [
          "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7",
          "0x8B3026aa2daAE85C2180eC0b5b9e17496a747cDB",
        ],
        POOL: "",
      },
      "USDT-TOAST": {
        tokens: [
          "0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0",
          "0x8B3026aa2daAE85C2180eC0b5b9e17496a747cDB",
        ],
        POOL: "0xA4b45397B44841CF6eB1cE52b3509838612aDbE8",
      },
      "WMATIC-TOAST": {
        tokens: [
          "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
          "0x8B3026aa2daAE85C2180eC0b5b9e17496a747cDB",
        ],
        POOL: "",
      },
    },
  },
  bsct: {
    chainId: 97,
    blockTime: BLOCK_TIMES[97],
    uniswapV3: {
      chainId: 97,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 2500, 10000],
      factoryV3: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      subgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      wETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      meta: {
        tickLens: "0xac1cE734566f390A94b00eb9bf561c2625BF44ea",
        quoter: "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2",
        swapRouter: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
        positionManager: "0x427bF5b37357632377eCbEC9de3626C71A5396c1",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7",
      },
    },
    pancakeswapV3: { meta: {} },
    sushiswap: { meta: {} },
    token: {
      WBNB: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      USDT: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD",
      BUSD: "0x1010Bb1b9Dff29e6233E7947e045e0ba58f6E92e",
      TOAST: "0x78F7c7d9576964727eea5044bed56fE24093F2E5",
    },
    mintableToken: {
      USDT: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD",
      BUSD: "0x1010Bb1b9Dff29e6233E7947e045e0ba58f6E92e",
    },
    pair: {
      "USDT-WBNB": {
        tokens: [
          "0xF49E250aEB5abDf660d643583AdFd0be41464EfD",
          "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        ],
        POOL: "0x56822aCd07cE93523c493Ffea702b11051Aa8Bd4",
      },
      "BUSD-WBNB": {
        tokens: [
          "0x1010Bb1b9Dff29e6233E7947e045e0ba58f6E92e",
          "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        ],
        POOL: "0x6382D4A0eeBfF0d71B7Fa37b9F4D3bC3Bf3980c9",
      },
      "USDT-BUSD": {
        tokens: [
          "0xF49E250aEB5abDf660d643583AdFd0be41464EfD",
          "0x1010Bb1b9Dff29e6233E7947e045e0ba58f6E92e",
        ],
        POOL: "0xbae09c6220F71Bf994DD34F823d0FE29366A59b2",
      },
      "USDT-TOAST": {
        tokens: [
          "0xF49E250aEB5abDf660d643583AdFd0be41464EfD",
          "0x78F7c7d9576964727eea5044bed56fE24093F2E5",
        ],
        POOL: "0xA28c6B79eF48358c1EC031a08a3AE458Bce4afE8",
      },
      "BUSD-TOAST": {
        tokens: [
          "0x1010Bb1b9Dff29e6233E7947e045e0ba58f6E92e",
          "0x78F7c7d9576964727eea5044bed56fE24093F2E5",
        ],
        POOL: "0x406e9F8980c165C115AbBD1fcB0a0ffA9B4e689f",
      },
      "WBNB-TOAST": {
        tokens: [
          "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
          "0x78F7c7d9576964727eea5044bed56fE24093F2E5",
        ],
        POOL: "0x5872fA159400F732238189046d816D9Acd2D3ee1",
      },
    },
  },

  ethereum: {
    chainId: 1,
    blockTime: BLOCK_TIMES[1],
    uniswapV3: {
      chainId: 1,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      subgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      wETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      meta: {
        tickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
        quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e", // Quoter V2
        swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // SwapRouter V2
        positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7",
      },
    },
    pancakeswapV3: {
      chainId: 5,
      projectName: "Pancakeswap V3",
      feeTiers: [100, 500, 2500, 10000],
      factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      subgraph: "",
      wETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      meta: {
        tickLens: "0xac1cE734566f390A94b00eb9bf561c2625BF44ea",
        quoter: "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2", // Quoter V2
        swapRouter: "0x1b81D678ffb9C0263b24A97847620C99d213eB14", // SwapRouter V2
        positionManager: "0x427bF5b37357632377eCbEC9de3626C71A5396c1",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: ZeroAddress,
      },
    },
    sushiswap: {
      meta: {},
    },
    curve: {
      api: "https://api.curve.fi/api/getPools/ethereum/main",
    },
  },
  polygon: {
    chainId: 137,
    blockTime: BLOCK_TIMES[137],
    uniswapV3: {
      chainId: 137,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      subgraph:
        "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
      wETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      meta: {
        tickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
        quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e", // Quoter V2
        swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // SwapRouter V2
        positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7", // TODO: add toaster address
      },
    },
    pancakeswapV3: {
      meta: {},
    },
    sushiswap: { meta: {} },
    curve: {
      api: "https://api.curve.fi/api/getPools/polygon/main",
    },
  },
  binance: {
    chainId: 56,
    blockTime: BLOCK_TIMES[56],
    uniswapV3: {
      chainId: 56,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
      subgraph:
        "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc",
      wETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      meta: {
        tickLens: "0xD9270014D396281579760619CCf4c3af0501A47C",
        quoter: "0x78D78E420Da98ad378D7799bE8f4AF69033EB077", // Quoter V2
        swapRouter: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2", // SwapRouter V2
        positionManager: "0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7", // TODO: add toaster address
      },
    },
    pancakeswapV3: {
      chainId: 56,
      projectName: "Pancakeswap V3",
      feeTiers: [100, 500, 2500, 10000],
      factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      wETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      meta: {
        MasterChefV3: "0x556B9306565093C855AEA9AE92A594704c2Cd59e",
        SmartRouter: "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",
        SmartRouterHelper: "0xdAecee3C08e953Bd5f89A5Cc90ac560413d709E3",
        MixedRouteQuoterV1: "0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86",
        QuoterV2: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
        TokenValidator: "0x864ED564875BdDD6F421e226494a0E7c071C06f8",
        PancakeV3Factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
        SwapRouter: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
        V3Migrator: "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2",
        TickLens: "0x9a489505a00cE272eAa5e07Dba6491314CaE3796",
        NonfungibleTokenPositionDescriptor:
          "0x3D00CdB4785F0ef20C903A13596e0b9B2c652227",
        NonfungiblePositionManager:
          "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
        PancakeInterfaceMulticall: "0xac1cE734566f390A94b00eb9bf561c2625BF44ea",
        PancakeV3LmPoolDeployer: "0x769449da49D1Eb1FF44A6B366BE46960fDF46Ad6",
        Menu: "0x1d90546025045056c869a8cf548a38b69082e27a",
        Toaster: "0x14223fb38d9cc73b5e8daff4b36fd8b1c3ff3658",
      },
      subgraph: "",
    },

    sushiswap: { meta: {} },
  },
  arbitrum: {
    chainId: 42161,
    blockTime: BLOCK_TIMES[42161],
    uniswapV3: {
      chainId: 42161,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      subgraph:
        "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal",
      wETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      meta: {
        tickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
        quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e", // Quoter V2
        swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // SwapRouter V2
        positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7",
      },
    },
    pancakeswapV3: { meta: {} },
    sushiswap: { meta: {} },
    curve: {
      api: "https://api.curve.fi/api/getPools/arbitrum/main",
    },
  },
  base: {
    chainId: 8453,
    blockTime: BLOCK_TIMES[8453],
    uniswapV3: {
      chainId: 8453,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
      subgraph: "NEED TO ADD",
      wETH: "0x4200000000000000000000000000000000000006",
      meta: {
        tickLens: "0x0CdeE061c75D43c82520eD998C23ac2991c9ac6d",
        quoter: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a", // Quoter V2
        swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481", // SwapRouter V2
        positionManager: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0x1d90546025045056c869a8cf548a38b69082e27a",
      },
    },
    pancakeswapV3: {},
    sushiswap: {},
    curve: {},
  },
  optimism: {
    chainId: 10,
    blockTime: BLOCK_TIMES[10],
    uniswapV3: {
      chainId: 10,
      projectName: "Uniswap V3",
      feeTiers: [100, 500, 3000, 10000],
      factoryV3: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      subgraph: "", //TODO: add subgraph
      wETH: "0x4200000000000000000000000000000000000006",
      meta: {
        tickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
        quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e", // Quoter V2
        swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // SwapRouter V2
        positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        menu: "0xa48719d977e5823a7881ba3d7a49b81673adaebb",
        toaster: "0xb8e0cdbad514edc1e8e790f4b6f5f613361802a7",
      },
    },
    pancakeswapV3: { meta: {} },
    sushiswap: { meta: {} },
    curve: {},
  },
};
