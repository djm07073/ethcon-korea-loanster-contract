import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  IApproveAndCall,
  IERC20,
  IUniswapV3Factory,
  IUniswapV3Pool,
  IWETH9,
  UniswapV3Menu,
  UniswapV3Toaster,
} from "../typechain-types";

import { ethers } from "hardhat";
import ADDRESS from "../config/address-mainnet-fork.json";
import { IUniswapV3Toaster } from "../typechain-types/contracts/UniswapV3Toaster";
import { ContractTransactionReceipt } from "ethers";
const UNISWAPV3_FACTORY = ADDRESS.UNISWAP_FACTORY;
const UNISWAPV3_POSITION_MANAGER = ADDRESS.NFTPOSITIONMANAGER;
describe("Test USDC/WETH", () => {
  let menu: UniswapV3Menu;
  let toaster: UniswapV3Toaster;
  let pool: IUniswapV3Pool;
  let factory: IUniswapV3Factory;
  let signer: HardhatEthersSigner;
  let weth: IWETH9;
  let usdc: IERC20;
  let matic: IERC20;
  before("Deploy UniswapV3 Toaster", async () => {
    // Deploy menu & Deploy UniswapV3Toaster
    [signer] = await ethers.getSigners();
    factory = await ethers.getContractAt(
      "IUniswapV3Factory",
      UNISWAPV3_FACTORY
    );
    const menu_f = await ethers.getContractFactory("UniswapV3Menu");
    menu = await menu_f.deploy();
    const toaster_f = await ethers.getContractFactory("UniswapV3Toaster");
    toaster = await toaster_f
      .deploy(
        UNISWAPV3_FACTORY,
        UNISWAPV3_POSITION_MANAGER,
        ADDRESS.WETH,
        await menu.getAddress()
      )
      .then((tx) => tx.waitForDeployment());

    weth = await ethers.getContractAt("IWETH9", ADDRESS.WETH);
    usdc = await ethers.getContractAt("IERC20", ADDRESS.USDC);
    matic = await ethers.getContractAt("IERC20", ADDRESS.MATIC);
    const crv = await ethers.getContractAt("IERC20", ADDRESS.CRV);
    await weth.approve(await toaster.getAddress(), ethers.MaxUint256);
    await usdc.approve(await toaster.getAddress(), ethers.MaxUint256);
    await crv.approve(await toaster.getAddress(), ethers.MaxUint256);
    await matic.approve(await toaster.getAddress(), ethers.MaxUint256);
  });
  it(`🧪 Make WETH & USDC & MATIC`, async () => {
    await weth.deposit({
      value: ethers.parseEther("100"),
    });
    await toaster.exactInputSingle({
      tokenIn: ADDRESS.WETH,
      tokenOut: ADDRESS.USDC,
      fee: 3000,
      recipient: signer.address,
      amountIn: ethers.parseEther("0.1"),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    });

    await toaster.exactInputSingle({
      tokenIn: ADDRESS.WETH,
      tokenOut: ADDRESS.MATIC,
      fee: 3000,
      recipient: signer.address,
      amountIn: ethers.parseEther("0.1"),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    });
  });

  it.skip("Invest only 2 USDC - ERROR CASE", async () => {
    const toasterItf = toaster.interface;
    const amount0 = ethers.parseUnits("2", 6); // USDC
    const token0 = ADDRESS.USDC;
    const amount1 = 0n; // WETH
    const token1 = ADDRESS.WETH;
    const nativeInputAmount = 0n;
    const [swapAmountIn, swapAmountOut, isSwap0] =
      await menu.getSwapAmountForAddLiquidity({
        pool: ADDRESS.POOL_USDC_WETH,
        tickUpper: 201300n,
        tickLower: 201190n,
        amount0: amount0,
        amount1: amount1,
        height: 120,
      });

    const [tokenIn, tokenOut, amountIn, amountOut] = isSwap0
      ? [token0, token1, amount0, amount1]
      : [token1, token0, amount1, amount0];
    const exactInputSingleBySelfParams: IUniswapV3Toaster.ExactInputBySelfParamsStruct =
      {
        tokenIn,
        tokenOut,
        fee: 3000,
        amountIn: swapAmountIn,
      };

    const mintParams: IApproveAndCall.MintParamsStruct = {
      token0: tokenIn < tokenOut ? tokenOut : tokenIn,
      token1: tokenOut < tokenIn ? tokenOut : tokenIn,
      fee: 3000,
      tickUpper: 201300,
      tickLower: 201190,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
    };

    const multicallData: string[] = [];
    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("wrapETH", [nativeInputAmount])
      );
    }

    if (amountIn > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenIn, amountIn])
      );
    }
    if (amountOut > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenOut, amountOut])
      );
    }

    multicallData.push(
      toasterItf.encodeFunctionData("exactInputSingleBySelf", [
        exactInputSingleBySelfParams,
      ])
    );

    multicallData.push(
      toasterItf.encodeFunctionData("approveMax", [tokenIn]),
      toasterItf.encodeFunctionData("approveMax", [tokenOut]),
      toasterItf.encodeFunctionData("mint", [mintParams])
    );

    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("unwrapWETH9(uint256)", [0n]),
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn == token1 ? tokenOut : tokenIn,
          0n,
        ])
      );
    } else {
      multicallData.push(
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn,
          0n,
        ]), // sweepToken tokenIn
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenOut,
          0n,
        ])
      );
    }
    const receipt = await toaster["multicall(bytes[])"](multicallData, {
      value: nativeInputAmount,
    })
      .then((t) => t.wait())
      .then((receipt) => receipt as ContractTransactionReceipt);
  });
  it.skip("Invest only 0.01WETH - ERROR CASE", async () => {
    const nativeInputAmount = 0;
    const toasterItf = toaster.interface;
    const amount0 = 0n; // USDC
    const token0 = ADDRESS.USDC;
    const amount1 = ethers.parseEther("0.01"); // WETH
    const token1 = ADDRESS.WETH;

    const tick = await ethers
      .getContractAt("IUniswapV3Pool", ADDRESS.POOL_USDC_WETH)
      .then((l) => l.slot0())
      .then((slot0) => slot0.tick);

    const [swapAmountIn, swapAmountOut, isSwap0] =
      await menu.getSwapAmountForAddLiquidity({
        pool: ADDRESS.POOL_USDC_WETH,
        tickUpper: 201300n,
        tickLower: 201190n,
        amount0: amount0,
        amount1: amount1,
        height: 120,
      });
    await pool.slot0().then((slot0) => {
      console.log(slot0.tick);
    });
    const [tokenIn, tokenOut, amountIn, amountOut] = isSwap0
      ? [token0, token1, amount0, amount1]
      : [token1, token0, amount1, amount0];
    const exactInputSingleBySelfParams: IUniswapV3Toaster.ExactInputBySelfParamsStruct =
      {
        tokenIn,
        tokenOut,
        fee: 3000,
        amountIn: swapAmountIn,
      };

    const mintParams: IApproveAndCall.MintParamsStruct = {
      token0: tokenIn < tokenOut ? tokenIn : tokenOut,
      token1: tokenOut < tokenIn ? tokenIn : tokenOut,
      fee: 3000,
      tickUpper: 201300n,
      tickLower: 201190n,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
    };

    const multicallData: string[] = [];
    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("wrapETH", [nativeInputAmount])
      );
    }

    if (amountIn > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenIn, amountIn])
      );
    }
    if (amountOut > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenOut, amountOut])
      );
    }

    multicallData.push(
      toasterItf.encodeFunctionData("exactInputSingleBySelf", [
        exactInputSingleBySelfParams,
      ])
    );

    multicallData.push(
      toasterItf.encodeFunctionData("approveMax", [tokenIn]),
      toasterItf.encodeFunctionData("approveMax", [tokenOut]),
      toasterItf.encodeFunctionData("mint", [mintParams])
    );

    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("unwrapWETH9(uint256)", [0n]),
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn == token1 ? tokenOut : tokenIn,
          0n,
        ])
      );
    } else {
      multicallData.push(
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn,
          0n,
        ]), // sweepToken tokenIn
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenOut,
          0n,
        ])
      );
    }
    const receipt = await toaster["multicall(bytes[])"](multicallData, {
      value: nativeInputAmount,
    })
      .then((t) => t.wait())
      .then((receipt) => receipt as ContractTransactionReceipt);
  });

  it.skip("Invest only 0.1WETH - SUCCESS CASE", async () => {
    const toasterItf = toaster.interface;
    const amount0 = 0n; // MATIC
    const token0 = ADDRESS.MATIC;
    const amount1 = ethers.parseEther("0.1"); // WETH
    const token1 = ADDRESS.WETH;
    const nativeInputAmount = 0n;
    const tickLower = -79920;
    const tickUpper = -79740;

    const [swapAmountIn, swapAmountOut, isSwap0] =
      await menu.getSwapAmountForAddLiquidity({
        pool: ADDRESS.POOL_MATIC_WETH,
        tickUpper,
        tickLower,
        amount0: amount0,
        amount1: amount1 + nativeInputAmount,
        height: 72,
      });
    const [tokenIn, tokenOut, amountIn, amountOut] = isSwap0
      ? [token0, token1, amount0, amount1]
      : [token1, token0, amount1, amount0];

    const exactInputSingleBySelfParams: IUniswapV3Toaster.ExactInputBySelfParamsStruct =
      {
        tokenIn,
        tokenOut,
        fee: 3000,
        amountIn: swapAmountIn,
      };

    const mintParams: IApproveAndCall.MintParamsStruct = {
      token0: tokenIn < tokenOut ? tokenIn : tokenOut,
      token1: tokenOut < tokenIn ? tokenIn : tokenOut,
      fee: 3000,
      tickLower,
      tickUpper,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
    };
    console.log(mintParams);
    const multicallData: string[] = [];
    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("wrapETH", [nativeInputAmount])
      );
    }

    if (amountIn > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenIn, amountIn])
      );
    }
    if (amountOut > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenOut, amountOut])
      );
    }

    multicallData.push(
      toasterItf.encodeFunctionData("exactInputSingleBySelf", [
        exactInputSingleBySelfParams,
      ])
    );

    multicallData.push(
      toasterItf.encodeFunctionData("approveMax", [tokenIn]),
      toasterItf.encodeFunctionData("approveMax", [tokenOut]),
      toasterItf.encodeFunctionData("mint", [mintParams])
    );

    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("unwrapWETH9(uint256)", [0n]),
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn === token1 ? tokenOut : tokenIn,
          0n,
        ])
      );
    } else {
      multicallData.push(
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn,
          0n,
        ]), // sweepToken tokenIn
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenOut,
          0n,
        ])
      );
    }

    const receipt = await toaster["multicall(bytes[])"](multicallData, {
      value: nativeInputAmount,
    })
      .then((t) => t.wait())
      .then((receipt) => receipt as ContractTransactionReceipt);
  });

  it.skip("Invest only 10MATIC - SUCCESS CASE", async () => {
    const toasterItf = toaster.interface;
    const amount0 = ethers.parseEther("10"); // MATIC
    const token0 = ADDRESS.MATIC;
    const amount1 = 0n; // WETH
    const token1 = ADDRESS.WETH;
    const nativeInputAmount = 0n;
    const tickLower = -79920;
    const tickUpper = -79740;

    const tick = await ethers
      .getContractAt("IUniswapV3Pool", ADDRESS.POOL_MATIC_WETH)
      .then((l) => l.slot0())
      .then((slot0) => slot0.tick);
    const [swapAmountIn, swapAmountOut, isSwap0] =
      await menu.getSwapAmountForAddLiquidity({
        pool: ADDRESS.POOL_MATIC_WETH,
        tickLower,
        tickUpper,
        amount0: amount0,
        amount1: amount1 + nativeInputAmount,
        height: 72,
      });
    const [tokenIn, tokenOut, amountIn, amountOut] = isSwap0
      ? [token0, token1, amount0, amount1]
      : [token1, token0, amount1, amount0];
    const exactInputSingleBySelfParams: IUniswapV3Toaster.ExactInputBySelfParamsStruct =
      {
        tokenIn,
        tokenOut,
        fee: 3000,
        amountIn: swapAmountIn,
      };

    const mintParams: IApproveAndCall.MintParamsStruct = {
      token0: tokenIn < tokenOut ? tokenIn : tokenOut,
      token1: tokenOut < tokenIn ? tokenIn : tokenOut,
      fee: 3000,
      tickLower,
      tickUpper,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
    };

    const multicallData: string[] = [];
    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("wrapETH", [nativeInputAmount])
      );
    }

    if (amountIn > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenIn, amountIn])
      );
    }
    if (amountOut > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenOut, amountOut])
      );
    }

    multicallData.push(
      toasterItf.encodeFunctionData("exactInputSingleBySelf", [
        exactInputSingleBySelfParams,
      ])
    );

    multicallData.push(
      toasterItf.encodeFunctionData("approveMax", [tokenIn]),
      toasterItf.encodeFunctionData("approveMax", [tokenOut]),
      toasterItf.encodeFunctionData("mint", [mintParams])
    );

    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("unwrapWETH9(uint256)", [0n]),
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn == token1 ? tokenOut : tokenIn,
          0n,
        ])
      );
    } else {
      multicallData.push(
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn,
          0n,
        ]), // sweepToken tokenIn
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenOut,
          0n,
        ])
      );
    }

    const receipt = await toaster["multicall(bytes[])"](multicallData, {
      value: nativeInputAmount,
    })
      .then((t) => t.wait())
      .then((receipt) => receipt as ContractTransactionReceipt);
  });
  it("Invest only 0.1CRV on CRV/ETH - ERROR CASE", async () => {
    const toasterItf = toaster.interface;
    const amount0 = ethers.parseEther("0.1"); // WETH
    const token0 = ADDRESS.WETH;
    const amount1 = 0n; // CRV
    const token1 = ADDRESS.CRV;
    const nativeInputAmount = 0n;
    const tickLower = 80520;
    const tickUpper = 81300;
    const pooladdress = await factory.getPool(token0, token1, 3000);
    const tick = await ethers
      .getContractAt("IUniswapV3Pool", pooladdress)
      .then((l) => l.slot0())
      .then((slot0) => slot0.tick);
    console.log(tick);
    console.log(await weth.balanceOf(signer.address));
    const [swapAmountIn, swapAmountOut, isSwap0] =
      await menu.getSwapAmountForAddLiquidity({
        pool: pooladdress,
        tickLower,
        tickUpper,
        amount0: amount0,
        amount1: amount1 + nativeInputAmount,
        height: 72,
      });
    const [tokenIn, tokenOut, amountIn, amountOut] = isSwap0
      ? [token0, token1, amount0, amount1]
      : [token1, token0, amount1, amount0];
    const exactInputSingleBySelfParams: IUniswapV3Toaster.ExactInputBySelfParamsStruct =
      {
        tokenIn,
        tokenOut,
        fee: 3000,
        amountIn: swapAmountIn,
      };

    const mintParams: IApproveAndCall.MintParamsStruct = {
      token0: tokenIn < tokenOut ? tokenIn : tokenOut,
      token1: tokenOut < tokenIn ? tokenIn : tokenOut,
      fee: 3000,
      tickLower,
      tickUpper,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
    };

    const multicallData: string[] = [];
    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("wrapETH", [nativeInputAmount])
      );
    }

    if (amountIn > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenIn, amountIn])
      );
    }
    if (amountOut > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("pull", [tokenOut, amountOut])
      );
    }

    multicallData.push(
      toasterItf.encodeFunctionData("exactInputSingleBySelf", [
        exactInputSingleBySelfParams,
      ])
    );

    multicallData.push(
      toasterItf.encodeFunctionData("approveMax", [tokenIn]),
      toasterItf.encodeFunctionData("approveMax", [tokenOut]),
      toasterItf.encodeFunctionData("mint", [mintParams])
    );

    if (nativeInputAmount > 0n) {
      multicallData.push(
        toasterItf.encodeFunctionData("unwrapWETH9(uint256)", [0n]),
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn == token1 ? tokenOut : tokenIn,
          0n,
        ])
      );
    } else {
      multicallData.push(
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenIn,
          0n,
        ]), // sweepToken tokenIn
        toasterItf.encodeFunctionData("sweepToken(address,uint256)", [
          tokenOut,
          0n,
        ])
      );
    }

    const receipt = await toaster["multicall(bytes[])"](multicallData, {
      value: nativeInputAmount,
    })
      .then((t) => t.wait())
      .then((receipt) => receipt as ContractTransactionReceipt);
  });
});
