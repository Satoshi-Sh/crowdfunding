var express = require('express')
var router = express.Router()
const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  TransactionReceiptQuery,
  Hbar,
  TransferTransaction,
  TransactionId,
} = require('@hashgraph/sdk')
require('dotenv').config()

const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

//Create your Hedera Testnet client
const client = Client.forTestnet()
client.setOperator(myAccountId, myPrivateKey)
client.setDefaultMaxTransactionFee(new Hbar(100))
client.setMaxQueryPayment(new Hbar(50))

router.post('/register', async function (req, res) {
  const {userId} = req.body // extract user id from request body

  const privateKey = PrivateKey.generateED25519()
  const publicKey = privateKey.publicKey

  const transactionId = await new AccountCreateTransaction()
    .setKey(publicKey)
    .setInitialBalance(new Hbar(10)) // Set an initial balance
    .execute(client)

  const receipt = await transactionId.getReceipt(client)
  const newAccountId = receipt.accountId

  res.json({
    accountId: newAccountId.toString(),
    privateKey: privateKey.toString(),
  })
})

// Each fundraiser will have its own account
router.post('/createFundraiser', async function (req, res) {
  const {fundraiserId} = req.body // extract fundraiser id from request body

  // Generate a new key pair for this fundraiser
  const privateKey = PrivateKey.generateED25519()
  const publicKey = privateKey.publicKey

  // Create a new account with the generated key pair
  const transactionIdNewAccount = await new AccountCreateTransaction()
    .setKey(publicKey)
    .setInitialBalance(new Hbar(0)) // Set an initial balance
    .execute(client)

  const receiptNewAccount = await transactionIdNewAccount.getReceipt(client)
  const newAccountId = receiptNewAccount.accountId

  // Store the fundraiser id and the associated Hedera account id in your database

  res.json({
    fundraiserId: fundraiserId,
    accountId: newAccountId.toString(),
    privateKey: privateKey.toString(),
  })
})

router.post('/donate', async function (req, res) {
  const {senderPrivateKey, senderAccountId, recipientAccountId, amount} =
    req.body

  // Create the client with sender's account ID and private key
  const client = Client.forTestnet()
  client.setOperator(senderAccountId, senderPrivateKey)
  client.setDefaultMaxTransactionFee(new Hbar(100))

  // Convert the amount in dollars to Hbars
  const amountInHbars = Hbar.from(new BigNumber(amount), HbarUnit.USDCENT)

  try {
    const transactionId = await new TransferTransaction()
      .addHbarTransfer(senderAccountId, amountInHbars.negated()) // sender's account and the amount to send
      .addHbarTransfer(recipientAccountId, amountInHbars) // recipient's account and the amount to receive
      .execute(client)

    const receipt = await transactionId.getReceipt(client)

    res.json({status: 'success', transactionId: transactionId.toString()})
  } catch (err) {
    res.json({status: 'error', error: err})
  }
})

router.post('/anonymousDonate', async function (req, res) {
  const {cardNumber, expMonth, expYear, cvv, amount, recipientAccountId} =
    req.body

  try {
    // This buys USDC and deplosits it into our Circle account
    const circleResponse = await axios.post(
      'https://api-sandbox.circle.com/v1/payments',
      {
        idempotencyKey: new Date().getTime().toString(),
        metadata: {},
        amount: {
          amount: amount.toString(),
          currency: 'USD',
        },
        verification: 'cvv',
        source: {
          id: 'card:' + cardNumber,
          cvv: cvv,
          expMonth: expMonth,
          expYear: expYear,
          type: 'card',
        },
        description: `Anonymous donation of $${amount} to account ${recipientAccountId}`,
      },
      {
        headers: {
          Authorization: 'Bearer ' + process.env.CIRCLE_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    )

    const circlePayment = circleResponse.data

    // Check the payment status
    if (circlePayment.status !== 'paid') {
      return res
        .status(400)
        .json({status: 'error', error: 'Payment failed', circlePayment})
    }
  } catch (error) {
    return res.status(500).json({status: 'error', error: error.toString()})
  }

  // Convert the amount in dollars to Hbars and send to the recipient from our account
  const amountInHbars = Hbar.from(amount, HbarUnit.USDCENT)

  try {
    const transactionId = await new TransferTransaction()
      .addHbarTransfer(operatorId, amountInHbars.negated()) // sender's account and the amount to send
      .addHbarTransfer(recipientAccountId, amountInHbars) // recipient's account and the amount to receive
      .execute(client)

    const receipt = await transactionId.getReceipt(client)

    res.json({status: 'success', transactionId: transactionId.toString()})
  } catch (err) {
    res.status(500).json({status: 'error', error: err.toString()})
  }
})

router.post('/checkTransaction', async function (req, res, next) {
  const {transactionIdStr} = req.body // extract transaction id from request body

  // Create the transaction ID object from string
  const transactionId = TransactionId.fromString(transactionIdStr)

  // Get the transaction receipt
  const receipt = await new TransactionReceiptQuery()
    .setTransactionId(transactionId)
    .execute(client)

  // Check the transaction status
  const status = receipt.status

  // Respond with the transaction status
  res.json({status: status.toString()})
})

// For getting balance
router.get('/balance/:accountId', async function (req, res) {
  const {accountId} = req.params
  const balance = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client)
  res.json({hbars: balance.hbars.toTinybars().toString()})
})

router.get('/accountInfo/:accountId', async function (req, res, next) {
  const {accountId} = req.params
  const info = await new AccountInfoQuery()
    .setAccountId(accountId)
    .execute(client)
  res.json(info)
})

module.exports = router
