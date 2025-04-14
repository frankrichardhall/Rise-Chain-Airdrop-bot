const { ethers } = require('ethers');
const readline = require('readline');
const chalk = require('chalk');
const cliSpinners = require('cli-spinners');
const { network, CONTRACT_ADDRESSES, WETH_ABI, USDC_ABI } = require('../config/config');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function connectToNetwork(privateKey) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    if (!privateKey) {
      console.error(chalk.red('Error: No private key provided 🚫'));
      process.exit(1);
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    return { provider, wallet };
  } catch (error) {
    console.error(chalk.red('Connection error:', error.message));
    process.exit(1);
  }
}

function showSpinner(message) {
  const spinner = cliSpinners.dots.frames;
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${chalk.yellow(message)} ${spinner[i++ % spinner.length]}`);
  }, 100);
  return () => {
    clearInterval(interval);
    process.stdout.write('\r');
  };
}

async function confirmTransaction(details) {
  console.log(chalk.white('┌─── Transaction Preview ───┐'));
  for (const [key, value] of Object.entries(details)) {
    console.log(chalk.white(`│ ${key.padEnd(15)} : ${chalk.cyan(value)}`));
  }
  console.log(chalk.white('└──────────────────────────┘'));
  return new Promise(resolve => {
    rl.question(chalk.yellow('Confirm transaction? (y/n): '), answer => {
      resolve(['y', 'yes'].includes(answer.toLowerCase()));
    });
  });
}

async function displayBanner(provider) {
  try {
    const blockNumber = await provider.getBlockNumber();
    const gasPrice = await provider.getGasPrice();
    const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
    console.log(`
${chalk.white('===============================================')}
${chalk.yellow(`        Block: ${blockNumber} | Gas: ${parseFloat(gasPriceGwei).toFixed(2)} Gwei `)}
${chalk.white('===============================================')}
    `);
  } catch (error) {
    console.error(chalk.red('Error fetching network status:', error.message));
    console.log(`
${chalk.white('===============================================')}
${chalk.yellow('     Network status unavailable')}
${chalk.white('===============================================')}
    `);
  }
}

async function getWalletInfo(wallet, provider) {
  const address = wallet.address;
  const ethBalance = await provider.getBalance(address);
  const weth = new ethers.Contract(CONTRACT_ADDRESSES.WETH, WETH_ABI, wallet);
  const usdc = new ethers.Contract(CONTRACT_ADDRESSES.USDC, USDC_ABI, wallet);

  const [wethBalance, usdcBalance, usdcDecimals] = await Promise.all([
    weth.balanceOf(address).catch(() => ethers.BigNumber.from(0)),
    usdc.balanceOf(address).catch(() => ethers.BigNumber.from(0)),
    usdc.decimals().catch(() => 6)
  ]);

  console.log(chalk.white('\n===== WALLET INFORMATION ====='));
  console.log(chalk.white(`Your address : ${chalk.cyan(address)} 👤`));
  console.log(chalk.white(`ETH Balance  : ${chalk.cyan(ethers.utils.formatEther(ethBalance))} ${network.symbol}`));
  console.log(chalk.white(`WETH Balance : ${chalk.cyan(ethers.utils.formatEther(wethBalance))} WETH`));
  console.log(chalk.white(`USDC Balance : ${chalk.cyan(ethers.utils.formatUnits(usdcBalance, usdcDecimals))} USDC`));
  console.log(chalk.white(`Using proxy  : ${chalk.cyan('None')} 🌐`));
  console.log(chalk.white('=============================\n'));
}

function closeReadline() {
  rl.close();
}

module.exports = {
  rl,
  showSpinner,
  confirmTransaction,
  displayBanner,
  connectToNetwork,
  getWalletInfo,
  closeReadline
};
