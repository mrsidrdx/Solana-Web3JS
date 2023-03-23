const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  GetProgramAccountsFilter,
} = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const bs58 = require("bs58");

const tokenToDecimal = {
  USDT: 6,
  ETH: 18,
};

async function getTokenMint(wallet, solanaConnection, token) {
  const filters = [
    {
      dataSize: 165, //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, //location of our query in the account (bytes)
        bytes: wallet, //our search criteria, a base58 encoded string
      },
    },
  ];
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters: filters }
  );
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    //Parse the account data
    const parsedAccountInfo = account.account.data;
    const decimals =
      parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];
    if (decimals === tokenToDecimal[token]) {
      return parsedAccountInfo["parsed"]["info"]["mint"];
    }
  }
  // If no account is found, return null
  return null;
}

async function transferCustomToken(recipientPublicKeyString, amount, token) {
  try {
    // Connect to cluster
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new wallet keypair and airdrop SOL
    const senderPrivateKeyString = process.env.WALLET_SECRET_KEY;
    const senderPrivateKey = bs58.decode(senderPrivateKeyString);
    const fromWallet = Keypair.fromSecretKey(senderPrivateKey);

    // Get public key for receiver public key
    const toWallet = new PublicKey(recipientPublicKeyString);

    // Get token mint public key
    const tokenAddress = await getTokenMint(
      fromWallet.publicKey,
      connection,
      token
    );
    if (tokenAddress === null) {
      throw Error("Token mint address not found!");
    }
    const mint = new PublicKey(tokenAddress);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const amountToTransfer = amount * Math.pow(10, tokenToDecimal[token]);
    signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      amountToTransfer
    );
  } catch (e) {
    throw Error(e);
  }
}

module.exports = {
  transferCustomToken,
};

// Mint 1 new token to the "fromTokenAccount" account we just created
// let signature = await mintTo(
//     connection,
//     fromWallet,
//     mint,
//     fromTokenAccount.address,
//     fromWallet.publicKey,
//     10000000000
// );

// Create new token mint
// const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 18);
