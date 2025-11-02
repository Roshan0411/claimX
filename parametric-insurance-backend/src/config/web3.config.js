const { Web3 } = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.SEPOLIA_RPC_URL);

// Add account from private key for oracle operations
if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'YOUR_ORACLE_PRIVATE_KEY' && process.env.PRIVATE_KEY.length === 66) {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    console.log('Oracle account loaded successfully');
  } catch (error) {
    console.warn('Invalid private key format, oracle operations will be limited');
  }
} else {
  console.warn('Private key not configured, oracle operations will be limited');
}

module.exports = web3;