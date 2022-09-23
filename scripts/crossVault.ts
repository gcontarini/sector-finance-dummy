import { ethers } from "hardhat";
import { grantERC20 } from "./grantERC20";
import fs from 'fs';

async function deployBank(owner, guardian, manager, treasury) {
  const BANK = await ethers.getContractFactory("Bank");

  // Deploy bank contract
  // string memory uri, owner, guardian, manager, treasury
  const bank = await BANK.deploy('https://game.example/api/item/{id}.json', owner, guardian, manager, treasury);
  await bank.deployed()

  // Actually this step is not necessary since it was already setted in constructor
  // await bank.grantRole(utils.keccak256(utils.toUtf8Bytes("GUARDIAN")), owner)
  // await bank.grantRole(utils.keccak256(utils.toUtf8Bytes("MANAGER")), owner)

  return bank;
}

async function deployVault(tokenAddress, bankAddress, managementFee, owner, guardian, manager) {
  const VAULT = await ethers.getContractFactory("SectorVault");

  const vault = await VAULT.deploy(tokenAddress, bankAddress, managementFee, owner, guardian, manager);
  await vault.deployed();

  return vault;
}

async function main() {
  // 0xa2327a938Febf5FEC13baCFb16Ae10EcBc4cbDCF
  const erc20Addresses = {
    testEth: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    testAvax: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'
  }

  // Get address to be the deployer
  const [deployer] = await ethers.getSigners()
  const owner = deployer.address

  // Assumption: run this script with the first network already setted
  // ex: yarn hardhat run scripts/cross2Vault.ts --network testEth

  const bank = await deployBank(owner, owner, owner, owner)
  const vault = await deployVault(erc20Addresses['testEth'], bank.address, 0, owner, owner, owner)

  await bank.addPool({
    vault: vault.address,
    id: 0,
    managementFee: 0,
    decimals: 18,
    exists: true
  })

  console.log(`======= ETH =======`)
  console.log(`Bank deployed at ${bank.address}`);
  console.log(`Vault deployed at ${vault.address}`);

  // Write vault addresses to a file
  let jsonContent = JSON.stringify({
    eth: vault.address,
  });
  fs.writeFile("vaultAddress.json", jsonContent, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
  });

  // Found on etherscan
  // Address full of usdc
  const whaleAddress = '0x0A59649758aa4d66E25f08Dd01271e891fe52199'

  // Grant tokens to vault
  await grantERC20(
    vault.address,
    erc20Addresses['testEth'],
    10000000000,
    whaleAddress
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});