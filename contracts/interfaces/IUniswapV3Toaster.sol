// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.7.6;
pragma abicoder v2;

interface IUniswapV3Toaster {
    struct ExactInputBySelfParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        uint256 amountIn;
    }
}
