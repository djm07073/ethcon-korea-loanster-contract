import { ethers } from "hardhat";
import {
  INonfungiblePositionManager,
  ISwapRouter02,
  IUniswapV3Pool,
  IWETH9,
} from "../../typechain-types";

const setting = async (
  _pool: string,
  _weth: string,

  _swapRouter: string,
  _nonfungiblePositionManager: string
) => {
  const UniswapV3Pool: IUniswapV3Pool = await ethers.getContractAt(
    "IUniswapV3Pool",
    _pool
  );

  const token0_address: string = await UniswapV3Pool.token0(); // MATIC:  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
  const token1_address: string = await UniswapV3Pool.token1(); // WETH:  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  const token0 = await ethers.getContractAt("IERC20", token0_address);
  const token1 = await ethers.getContractAt("IERC20", token1_address);
  const [signer] = await ethers.getSigners();

  const WETH: IWETH9 = await ethers.getContractAt("IWETH9", _weth);

  //Set SwapRouter
  const SwapRouter: ISwapRouter02 = await ethers.getContractAt(
    "ISwapRouter02",
    _swapRouter
  );

  // Set NonfungiblePositionManager
  const NonfungiblePositionManager: INonfungiblePositionManager =
    await ethers.getContractAt(
      "INonfungiblePositionManager",
      _nonfungiblePositionManager
    );

  const tick = await UniswapV3Pool.slot0().then((t) => t.tick);

  return {
    signer,
    SwapRouter,
    NonfungiblePositionManager,
    UniswapV3Pool,
    WETH,
    tick,
    token0,
    token1,
  };
};

export default setting;
