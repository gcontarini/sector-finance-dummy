# Dummy project from sector finance
## This is a playground to test out solutions

# Create a .env first
```
DEPLOYER_KEY=<private key here>
MANAGER_KEY=<private key here>
INFURA_API_KEY=<api key here>
DEPLOYER=<public wallet address>
MANAGER=<public wallet address>
FORK_CHAIN='avalanche', 'fantom', 'mainnet', 'moonbeam', 'moonriver', 'mainnet'
```


```shell
npm install
npx hardhat node
npx hardhat run scripts/crossVault.ts
npx hardhat run scripts/monitorEvent.ts
npx hardhat run scripts/triggerEvent.ts
```
