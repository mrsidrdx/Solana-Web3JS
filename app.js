const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3030;

const { transferSOLToken } = require('./libs/sendTransaction');
const { transferCustomToken } = require('./libs/sendCustomToken');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

/* Transfer SOL Token */
app.post('/transfer-tokens', async (req, res, next) => {
  try {
      const { recipientPublicKey, amount, token } = req.body;
      if (token === 'SOL') {
        await transferSOLToken(recipientPublicKey, amount);
      } else {
        await transferCustomToken(recipientPublicKey, amount, token);
      }
      res.status(201).json({
        'status': 'success',
        'details': 'Token transferred successfully'
      });
  } catch(error) {
      next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});