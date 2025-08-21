# RISE Chain Airdrop Bot
An automated tool for interacting with the Rise Testnet, providing functionalities such as random asset transfers, Gas Pump operations, and Inari Bank services.

## Features
- Multi-wallet support
- Cross-platform and token bridge compatibility

## Requirements

- Node.js
- Private keys for the wallets you intend to use (stored in `privateKeys.json`).

## Main Menu

The bot provides an interactive menu with the following options:

- **Send to Random Addresses**: Automate multiple transfers to random addresses
- **Gas Pump**: Access token wrap/unwrap and swap functions
- **Inari Bank**: Supply or withdraw ETH from Inari Bank
- **Exit**: Close the application

### Gas Pump Menu

- **Wrap ETH to WETH**: Convert ETH to Wrapped ETH
- **Unwrap WETH to ETH**: Convert WETH back to ETH
- **Approve WETH for DODO**: Set token allowances for swaps
- **Swap WETH to USDC**: Exchange WETH for USDC tokens
- **Swap USDC to WETH**: Exchange USDC for WETH tokens
- **Back to main menu**: Return to main options

### Inari Bank Menu

- **Supply ETH to Inari Bank**: Deposit ETH to Inari Bank
- **Withdraw ETH from Inari Bank**: Withdraw your ETH from Inari Bank
- **Back to main menu**: Return to main options

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/frankrichardhall/Rise-Chain-Airdrop-bot.git
   cd Rise-Chain-Airdrop-bot
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Create `privateKeys.json`**:
   Create a file named `privateKeys.json` in the root directory with the following format:

   ```json
   [
     "your_private_key_1",
     "your_private_key_2"
   ]
   ```

4. **Run the Bot**:

   ```bash
   npm start
   ```

## Usage

- Use `npm start` to check the menu options available.
- Choose the appropriate command based on the network you want to use.
- The bot will automatically execute the transactions, handling any errors and retrying as needed.


## Contract Addresses

The bot uses the following contract addresses on Rise Testnet:

- **WrappedTokenGatewayV3**: 0x832e537e88d0e8e5bb4efb735f521a9a0e085e0a
- **WETH**: 0x4200000000000000000000000000000000000006
- **DODOFeeRouteProxy**: 0x8c6DbF95448AcbcBb1c3D6E9b3b9ceF7E6fbAb00
- **USDC**: 0x8A93d247134d91e0de6f96547cB0204e5BE8e5D8

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
 
 
 
 
 
 
 
 
 
 
 
 
 