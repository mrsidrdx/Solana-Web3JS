const solanaWeb3 = require("@solana/web3.js");
const bs58 = require('bs58');

async function transferSOLToken(recipientPublicKeyString, amount) {
    try {
        // Connect to the network provider
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl("devnet")
        );
        // Load your wallet
        const senderPrivateKeyString = process.env.WALLET_SECRET_KEY;
        const senderPrivateKey = bs58.decode(senderPrivateKeyString);
        const senderKeypair = solanaWeb3.Keypair.fromSecretKey(senderPrivateKey);

        // Public key of the recipient
        const recipientPublicKey = new solanaWeb3.PublicKey(recipientPublicKeyString);

        // Amount of tokens to send
        const lamportsToSend = amount * solanaWeb3.LAMPORTS_PER_SOL;

        // Create a token transfer transaction
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: recipientPublicKey,
            lamports: lamportsToSend,
            })
        );

        // Sign and send the transaction
        await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
        console.log("Transaction successful!");
    } catch (e) {
        throw Error('Transaction failed');
    }
}

module.exports = {
    transferSOLToken
}