const { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const bs58 = require('bs58');

async function requestAirdrop() {
    // Connect to cluster
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Generate a new wallet keypair and airdrop SOL
    const senderPrivateKeyString = process.env.WALLET_SECRET_KEY;
    const senderPrivateKey = bs58.decode(senderPrivateKeyString);
    const fromWallet = Keypair.fromSecretKey(senderPrivateKey);
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);
}