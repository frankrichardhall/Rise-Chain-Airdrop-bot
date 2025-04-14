const { showMainMenu } = require('./src/services/menus');

(async () => {
  console.log('Starting Rise Testnet Auto Bot...');
  try {
    await showMainMenu();
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
})();
