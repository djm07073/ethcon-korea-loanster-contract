// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.7.6;
pragma abicoder v2;
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/libraries/PositionValue.sol";
import "../libraries/RebalanceDepositBS.sol";
struct SwapAmountForAddLiquidityParams {
    IUniswapV3Pool pool;
    int24 tickUpper;
    int24 tickLower;
    uint112 amount0;
    uint112 amount1;
    uint8 height;
}
struct SwapAmountForIncreaseLiquidityParams {
    INonfungiblePositionManager positionManager;
    IUniswapV3Pool pool;
    uint tokenId;
    uint112 amount0;
    uint112 amount1;
    uint8 height;
}

interface IUniswapV3Menu {
    function getSwapAmountForAddLiquidity(
        SwapAmountForAddLiquidityParams calldata params
    ) external view returns (uint256 amountIn, uint256 amountOut, bool isSwapX);

    function getSwapAmountForIncreaseLiquidity(
        SwapAmountForIncreaseLiquidityParams calldata params
    ) external view returns (uint256 amountIn, uint256 amountOut, bool isSwapX);

    function total(
        INonfungiblePositionManager positionManager,
        uint256 tokenId,
        uint160 sqrtRatioX96
    ) external view returns (uint256 amount0, uint256 amount1);

    function principal(
        INonfungiblePositionManager positionManager,
        uint256 tokenId,
        uint160 sqrtRatioX96
    ) external view returns (uint256 amount0, uint256 amount1);

    function fees(
        INonfungiblePositionManager positionManager,
        uint256 tokenId
    ) external view returns (uint256 amount0, uint256 amount1);
}
