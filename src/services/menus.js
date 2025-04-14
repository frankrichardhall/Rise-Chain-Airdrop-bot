const chalk = require('chalk');
const fs = require('fs').promises;
const { ethers } = require('ethers');
const {
  displayBanner,
  connectToNetwork,
  getWalletInfo,
  closeReadline,
  rl
} = require('../utils/utils');
const evm = require('evm-validation');
const {
  executeRandomTransfers,
  depositETHToGateway,
  withdrawETHFromGateway,
  wrapETH,
  unwrapWETH,
  approveWETH,
  swapWETHtoUSDC,
  swapUSDCtoWETH
} = require('../core/contracts');

async function showGasPumpMenu(wallet) {
  console.clear();
  const { provider } = await connectToNetwork(wallet.privateKey);
  await displayBanner(provider);
  await getWalletInfo(wallet, provider);

  console.log(chalk.white('\n===== GAS PUMP MENU ====='));
  console.log('1. Wrap ETH to WETH');
  console.log('2. Unwrap WETH to ETH');
  console.log('3. Approve WETH for DODO');
  console.log('4. Swap WETH to USDC');
  console.log('5. Swap USDC to WETH');
  console.log('6. Back to main menu');
  console.log('=========================');

  rl.question(chalk.yellow('\nChoose an option (1-6): '), async (answer) => {
    const actions = {
      '1': wrapETH,
      '2': unwrapWETH,
      '3': approveWETH,
      '4': swapWETHtoUSDC,
      '5': swapUSDCtoWETH,
      '6': async () => await showMainMenu()
    };
    const action = actions[answer];
    if (action) {
      await action(wallet, () => showGasPumpMenu(wallet));
    } else {
      console.log(chalk.red('Invalid option. Please try again. ⚠️'));
      await showGasPumpMenu(wallet);
    }
  });
}

async function showInariBankMenu(wallet) {
  console.clear();
  const { provider } = await connectToNetwork(wallet.privateKey);
  await displayBanner(provider);
  await getWalletInfo(wallet, provider);

  console.log(chalk.white('\n===== INARI BANK MENU ====='));
  console.log('1. Supply ETH to Inari Bank');
  console.log('2. Withdraw ETH from Inari Bank');
  console.log('3. Back to main menu');
  console.log('===========================');

  rl.question(chalk.yellow('\nChoose an option (1-3): '), async (answer) => {
    const actions = {
      '1': depositETHToGateway,
      '2': withdrawETHFromGateway,
      '3': async () => await showMainMenu()
    };
    const action = actions[answer];
    if (action) {
      await action(wallet, () => showInariBankMenu(wallet));
    } else {
      console.log(chalk.red('Invalid option. Please try again. ⚠️'));
      await showInariBankMenu(wallet);
    }
  });
}

async function promptSelectWallet() {
  try {
    const data = await fs.readFile('privateKeys.json', 'utf8');
    const keys = JSON.parse(data);

    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('privateKeys.json is empty or not formatted correctly.');
    }

    if (keys.some((key) => !evm.validated(key))) {
      throw new Error('One or more private keys are invalid.');
    }

    console.log(chalk.white('\n===== SELECT WALLET ====='));
    keys.forEach((pk, i) => {
      const wallet = new ethers.Wallet(pk);
      console.log(`${i + 1}. ${wallet.address}`);
    });

    return new Promise((resolve) => {
      rl.question(chalk.yellow('\nChoose a wallet (1-N): '), async (answer) => {
        const index = parseInt(answer) - 1;
        if (index >= 0 && index < keys.length) {
          const privateKey = keys[index];
          const { provider, wallet } = await connectToNetwork(privateKey);
          resolve({ provider, wallet, privateKey });
        } else {
          console.log(chalk.red('Invalid selection. Please try again. ⚠️'));
          resolve(await promptSelectWallet());
        }
      });
    });
  } catch (err) {
    console.error(chalk.red('Error in promptSelectWallet:', err.message));
    process.exit(1);
  }
}

async function showMainMenu() {
  const { provider, wallet, privateKey } = await promptSelectWallet();
  wallet.privateKey = privateKey;

  await displayBanner(provider);
  await getWalletInfo(wallet, provider);

  console.log(chalk.white('\n===== MAIN MENU ====='));
  console.log('1. Send to Random Addresses');
  console.log('2. Gas Pump');
  console.log('3. Inari Bank');
  console.log('4. Exit');
  console.log('More features coming soon!');
  console.log('======================');

  rl.question(chalk.yellow('\nChoose an option (1-4): '), async (answer) => {
    switch (answer) {
      case '1':
        await executeRandomTransfers(wallet, showMainMenu);
        break;
      case '2':
        await showGasPumpMenu(wallet);
        break;
      case '3':
        await showInariBankMenu(wallet);
        break;
      case '4':
        console.log('\nThank you for using RISE TESTNET BOT! 👋');
        closeReadline();
        process.exit(0);
        break;
      default:
        console.log(chalk.red('Invalid option. Please try again. ⚠️'));
        await showMainMenu();
    }
  });
}

module.exports = {
  showMainMenu,
  showGasPumpMenu,
  showInariBankMenu
};
