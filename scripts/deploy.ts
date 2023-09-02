import { UniswapV3Toaster__factory } from "./../typechain-types/factories/contracts/UniswapV3Toaster__factory";
import { ethers, network, upgrades } from "hardhat";
import { CONFIGS } from "../config/address";
import { ZeroAddress } from "ethers";

async function deployToaster(
  addressFactoryV3: string,
  addressPositionManager: string,
  addressWETH9: string,
  addressMenu: string
) {
  // deploy the toaster
  const toaster_f: UniswapV3Toaster__factory = await ethers.getContractFactory(
    "UniswapV3Toaster"
  );
  const toaster = await toaster_f
    .deploy(addressFactoryV3, addressPositionManager, addressWETH9, addressMenu)
    .then((c) => c.waitForDeployment());
  console.log(
    "Toaster deployed to:",
    (await toaster.getAddress()).toLocaleLowerCase()
  );
  return toaster.getAddress();
}
async function deployMenu() {
  const menu_f = await ethers.getContractFactory("UniswapV3Menu");
  const menu = await menu_f.deploy().then((c) => c.waitForDeployment());
  console.log("Menu deployed to:", (await menu.getAddress()).toLowerCase());
  return menu.getAddress();
}

async function main() {
  for (const [key, value] of Object.entries(CONFIGS)) {
    if (value.chainId == network.config.chainId) {
      if (value.uniswapV3.meta.menu == ZeroAddress) {
        const menu = await deployMenu();
        await deployToaster(
          value.uniswapV3.factoryV3,
          value.uniswapV3.meta.positionManager,
          value.uniswapV3.wETH,
          menu
        );
      } else {
        await deployToaster(
          value.uniswapV3.factoryV3,
          value.uniswapV3.meta.positionManager,
          value.uniswapV3.wETH,
          value.uniswapV3.meta.menu
        );
      }
    }
  }
}

main();
