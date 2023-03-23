function submitForm(event) {
    // Get input field data by ID
    const recipientPublicKey = document.getElementById('recipient-public-key').value;
    const amount = document.getElementById('amount').value;
    const token = document.getElementById('token').value;

    document.getElementById('submitButton').value = 'Sending...';

    transferTokenToRecipient(recipientPublicKey, amount, token);

    // Prevent the form from refreshing the page
    event.preventDefault();
}

function transferTokenToRecipient(recipientPublicKey, amount, token) {
    axios.post('/transfer-tokens', {
        recipientPublicKey: recipientPublicKey,
        amount: amount,
        token: token
      })
      .then(function (response) {
        var messageEl = document.getElementById('message');
        messageEl.textContent = `${amount} ${token} transferred to ${recipientPublicKey}`;
        messageEl.style.color = 'green';
        document.getElementById('submitButton').value = 'Send Payment';
      })
      .catch(function (error) {
        var messageEl = document.getElementById('message');
        messageEl.textContent = 'Transaction failed!';
        messageEl.style.color = 'red';
        document.getElementById('submitButton').value = 'Send Payment';
      });
}