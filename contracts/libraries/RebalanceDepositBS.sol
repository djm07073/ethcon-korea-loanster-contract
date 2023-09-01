pragma solidity >=0.6.0;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/libraries/LiquidityMath.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";

import "./ToasterLibraryForUniV3.sol";

library RebalanceDepositBS {
    using ToasterLibraryForUniV3 for IUniswapV3Pool;
    using LowGasSafeMath for uint256;
    using LowGasSafeMath for int256;
    using SafeCast for uint256;
    using SafeCast for int256;

    struct RebalanceDepositParams {
        IUniswapV3Pool pool;
        uint112 amount0;
        uint112 amount1;
        uint8 height;
        int24 tickUpper;
        int24 tickLower;
        uint24 fee;
    }
    struct RebalanceIncreaseParams {
        INonfungiblePositionManager positionManager;
        IUniswapV3Pool pool;
        uint tokenId;
        uint112 amount0;
        uint112 amount1;
        uint8 height;
        int24 tickLower;
        int24 tickUpper;
        uint24 fee;
    }
    struct BinarySearchParams {
        IUniswapV3Pool pool;
        bool isSwap0;
        uint8 height;
        uint112 amount0;
        uint112 amount1;
        uint160 sqrtPriceX96Lower;
        uint160 sqrtPriceX96Upper;
        uint160 sqrtPriceX96;
        int24 tick;
        uint24 fee;
    }

    function rebalanceDeposit(
        RebalanceDepositParams memory params
    )
        internal
        view
        returns (uint256 amountIn, uint256 amountOut, bool isSwap0)
    {
        require(address(params.pool) != address(0), "pool does not exist");
        require(params.tickUpper > params.tickLower, "UL");

        uint160 sqrtPriceX96;
        uint160 sqrtPriceX96Upper;
        uint160 sqrtPriceX96Lower;
        int24 tickCurrent;
        {
            (sqrtPriceX96, tickCurrent, , , , , ) = IUniswapV3Pool(params.pool)
                .slot0();
            require(params.tickUpper > tickCurrent, "U");
            require(tickCurrent > params.tickLower, "L");

            sqrtPriceX96Upper = TickMath.getSqrtRatioAtTick(params.tickUpper);
            sqrtPriceX96Lower = TickMath.getSqrtRatioAtTick(params.tickLower);

            isSwap0 =
                LiquidityAmounts.getLiquidityForAmount0(
                    sqrtPriceX96,
                    sqrtPriceX96Upper,
                    params.amount0
                ) >
                LiquidityAmounts.getLiquidityForAmount1(
                    sqrtPriceX96Lower,
                    sqrtPriceX96,
                    params.amount1
                );
        }
        (amountIn, amountOut) = _binarySearch(
            BinarySearchParams({
                pool: params.pool,
                isSwap0: isSwap0,
                height: params.height,
                amount0: params.amount0,
                amount1: params.amount1,
                sqrtPriceX96Lower: TickMath.getSqrtRatioAtTick(
                    params.tickLower
                ),
                sqrtPriceX96Upper: TickMath.getSqrtRatioAtTick(
                    params.tickUpper
                ),
                sqrtPriceX96: sqrtPriceX96,
                tick: tickCurrent,
                fee: params.fee
            })
        );
    }

    function rebalanceIncrease(
        RebalanceIncreaseParams memory params
    )
        internal
        view
        returns (uint256 amountIn, uint256 amountOut, bool isSwap0)
    {
        uint160 sqrtPriceX96Lower;
        uint160 sqrtPriceX96Upper;
        uint160 sqrtPriceX96;
        int24 tickCurrent;
        {
            require(params.pool != IUniswapV3Pool(0), "pool does not exist");
            (sqrtPriceX96, tickCurrent, , , , , ) = IUniswapV3Pool(params.pool)
                .slot0();

            require(params.tickUpper > params.tickLower, "UL");
            require(params.tickUpper > tickCurrent, "U");
            require(tickCurrent > params.tickLower, "L");
            sqrtPriceX96Lower = TickMath.getSqrtRatioAtTick(params.tickLower);
            sqrtPriceX96Upper = TickMath.getSqrtRatioAtTick(params.tickUpper);
        }

        isSwap0 =
            FullMath.mulDiv(
                params.amount0,
                FullMath.mulDiv(
                    sqrtPriceX96,
                    sqrtPriceX96Upper,
                    FixedPoint96.Q96
                ),
                sqrtPriceX96Upper - sqrtPriceX96
            ) >
            FullMath.mulDiv(
                params.amount1,
                FixedPoint96.Q96,
                sqrtPriceX96 - sqrtPriceX96Lower
            );

        (amountIn, amountOut) = _binarySearch(
            BinarySearchParams({
                pool: params.pool,
                isSwap0: isSwap0,
                height: params.height,
                sqrtPriceX96Lower: sqrtPriceX96Lower,
                sqrtPriceX96Upper: sqrtPriceX96Upper,
                amount0: params.amount0,
                amount1: params.amount1,
                tick: tickCurrent,
                sqrtPriceX96: sqrtPriceX96,
                fee: params.fee
            })
        );
    }

    struct Cache {
        int24 _tickSpacing;
        uint128 _liquidity;
    }

    function _binarySearch(
        BinarySearchParams memory params
    ) internal view returns (uint amountIn, uint amountOut) {
        Cache memory cache;
        cache._liquidity = params.pool.liquidity();
        cache._tickSpacing = params.pool.tickSpacing();
        uint160 sqrtPriceX96Next;
        uint amountEnd;
        uint amountStart = 0;
        if (params.isSwap0) {
            // Swap X to Y
            amountEnd = params.amount0;
            uint amount0Mid;
            uint amount1Delta;
            for (uint8 _height = 0; _height < params.height; _height++) {
                // Set amount0Mid( = amount0Delta)
                amount0Mid = (amountStart + amountEnd) / 2;

                // get sqrtPriceX96Next and amount1Delta
                (
                    amount1Delta,
                    sqrtPriceX96Next
                ) = _getNextSqrtPriceX96AndAmountOut(
                    NextSqrtPriceParams({
                        pool: params.pool,
                        amountIn: amount0Mid,
                        zeroForOne: true,
                        tick: params.tick,
                        sqrtPriceX96: params.sqrtPriceX96,
                        liquidity: cache._liquidity,
                        fee: params.fee,
                        tickSpacing: cache._tickSpacing
                    })
                );

                if (
                    LiquidityAmounts.getLiquidityForAmount0(
                        sqrtPriceX96Next,
                        params.sqrtPriceX96Upper,
                        params.amount0 - amount0Mid
                    ) >
                    LiquidityAmounts.getLiquidityForAmount1(
                        params.sqrtPriceX96Lower,
                        sqrtPriceX96Next,
                        params.amount1 + amount1Delta
                    )
                ) {
                    //swapX more ,sqrtPriceX96Next will be more high
                    amountStart = amount0Mid;
                } else {
                    // swapX less,sqrtPriceX96Next will be more low
                    amountEnd = amount0Mid;
                }
            }
            amountIn = amount0Mid;
            amountOut = amount1Delta;
        } else {
            // Swap Y to X
            uint amount1Mid;
            uint amount0Delta;
            amountEnd = params.amount1;
            for (uint8 _height = 0; _height < params.height; _height++) {
                // Set amount1Mid(amount0Delta)
                amount1Mid = (amountStart + amountEnd) / 2;

                (
                    // get sqrtPriceX96Next
                    amount0Delta,
                    sqrtPriceX96Next
                ) = _getNextSqrtPriceX96AndAmountOut(
                    NextSqrtPriceParams({
                        pool: params.pool,
                        amountIn: amount1Mid,
                        zeroForOne: false,
                        tick: params.tick,
                        sqrtPriceX96: params.sqrtPriceX96,
                        liquidity: cache._liquidity,
                        fee: params.fee,
                        tickSpacing: cache._tickSpacing
                    })
                );

                if (
                    LiquidityAmounts.getLiquidityForAmount1(
                        params.sqrtPriceX96Lower,
                        sqrtPriceX96Next,
                        params.amount1 - amount1Mid
                    ) >
                    LiquidityAmounts.getLiquidityForAmount0(
                        sqrtPriceX96Next,
                        params.sqrtPriceX96Upper,
                        params.amount0 + amount0Delta
                    )
                ) {
                    //swapY more ,PriceX96Next will be more low
                    amountStart = amount1Mid;
                } else {
                    // swapY less,PriceX96Next will be more high
                    amountEnd = amount1Mid;
                }
            }
            amountIn = amount1Mid;
            amountOut = amount0Delta;
        }
    }

    struct NextSqrtPriceParams {
        IUniswapV3Pool pool;
        uint256 amountIn;
        int24 tick;
        bool zeroForOne; //true: 0 -> 1, false 1 -> 0
        uint160 sqrtPriceX96;
        uint128 liquidity;
        uint24 fee;
        int24 tickSpacing;
    }

    struct StepComputations {
        // the price at the beginning of the step
        uint160 sqrtPriceStartX96;
        // the next tick to swap to from the current tick in the swap direction
        int24 tickNext;
        // whether tickNext is initialized or not
        bool initialized;
        // sqrt(price) for the next tick (1/0)
        uint160 sqrtPriceNextX96;
        // how much is being swapped in in this step
        uint256 amountIn;
        // how much is being swapped out
        uint256 amountOut;
        // how much fee is being paid in
        uint256 feeAmount;
    }

    function _getNextSqrtPriceX96AndAmountOut(
        NextSqrtPriceParams memory params
    )
        internal
        view
        returns (uint finalAmountOut, uint160 finalSqrtPriceX96Next)
    {
        // continue swapping as long as we haven't used the entire input/output and haven't reached the price limit
        uint256 amountCalculated;

        while (params.amountIn != 0) {
            StepComputations memory step;

            step.sqrtPriceStartX96 = params.sqrtPriceX96;

            (step.tickNext, step.initialized) = params
                .pool
                .nextInitializedTickWithinOneWord(
                    params.tick,
                    params.tickSpacing,
                    params.zeroForOne
                ); // 다음 가격 틱 중에 initialized된 것을 가져온다.

            // ensure that we do not overshoot the min/max tick, as the tick bitmap is not aware of these bounds
            if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
            } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
            }

            // get the price for the next tick
            step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);

            // compute values to swap to the target tick, price limit, or point where input/output amount is exhausted
            (
                params.sqrtPriceX96,
                step.amountIn,
                step.amountOut,
                step.feeAmount
            ) = ToasterLibraryForUniV3.computeSwapStep(
                params.sqrtPriceX96,
                step.sqrtPriceNextX96,
                params.liquidity,
                params.amountIn,
                params.fee
            );
            // always input
            params.amountIn -= (step.amountIn + step.feeAmount);
            amountCalculated = amountCalculated.add(step.amountOut);

            // shift tick if we reached the next price
            if (params.sqrtPriceX96 == step.sqrtPriceNextX96) {
                // if the tick is initialized, run the tick transition
                if (step.initialized) {
                    (, int128 liquidityNet, , , , , , ) = params.pool.ticks(
                        step.tickNext
                    );
                    // if we're moving leftward, we interpret liquidityNet as the opposite sign
                    // safe because liquidityNet cannot be type(int128).min
                    if (params.zeroForOne) liquidityNet = -liquidityNet;

                    params.liquidity = LiquidityMath.addDelta(
                        params.liquidity,
                        liquidityNet
                    );
                }

                params.tick = params.zeroForOne
                    ? step.tickNext - 1
                    : step.tickNext;
            } else if (params.sqrtPriceX96 != step.sqrtPriceStartX96) {
                // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
                params.tick = TickMath.getTickAtSqrtRatio(params.sqrtPriceX96);
            }
        }
        finalAmountOut = amountCalculated;
        finalSqrtPriceX96Next = params.sqrtPriceX96;
    }
}
