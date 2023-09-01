// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/PositionValue.sol";
import "./interfaces/IUniswapV3Menu.sol";

contract UniswapV3Menu is IUniswapV3Menu {
    function getSwapAmountForAddLiquidity(
        SwapAmountForAddLiquidityParams calldata params
    )
        external
        view
        override
        returns (uint256 amountIn, uint256 amountOut, bool isSwapX)
    {
        return
            RebalanceDepositBS.rebalanceDeposit(
                RebalanceDepositBS.RebalanceDepositParams({
                    pool: params.pool,
                    tickUpper: params.tickUpper,
                    tickLower: params.tickLower,
                    amount0: params.amount0,
                    amount1: params.amount1,
                    height: params.height,
                    fee: params.pool.fee()
                })
            );
    }

    function getSwapAmountForIncreaseLiquidity(
        SwapAmountForIncreaseLiquidityParams calldata params
    )
        external
        view
        override
        returns (uint256 amountIn, uint256 amountOut, bool isSwapX)
    {
        (, , , , , int24 tickLower, int24 tickUpper, , , , , ) = params
            .positionManager
            .positions(params.tokenId);
        return
            RebalanceDepositBS.rebalanceIncrease(
                RebalanceDepositBS.RebalanceIncreaseParams({
                    positionManager: params.positionManager,
                    pool: params.pool,
                    tokenId: params.tokenId,
                    amount0: params.amount0,
                    amount1: params.amount1,
                    height: params.height,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    fee: params.pool.fee()
                })
            );
    }

    function total(
        INonfungiblePositionManager positionManager,
        uint256 tokenId,
        uint160 sqrtRatioX96
    ) external view override returns (uint256 amount0, uint256 amount1) {
        return PositionValue.total(positionManager, tokenId, sqrtRatioX96);
    }

    function principal(
        INonfungiblePositionManager positionManager,
        uint256 tokenId,
        uint160 sqrtRatioX96
    ) external view override returns (uint256 amount0, uint256 amount1) {
        return PositionValue.principal(positionManager, tokenId, sqrtRatioX96);
    }

    function fees(
        INonfungiblePositionManager positionManager,
        uint256 tokenId
    ) external view override returns (uint256 amount0, uint256 amount1) {
        return PositionValue.fees(positionManager, tokenId);
    }
}
