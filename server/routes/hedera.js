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
var {Circle, CircleEnvironments} = require('@circle-fin/circle-sdk')
require('dotenv').config()

const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

//Create your Hedera Testnet client
const client = Client.forTestnet()
client.setOperator(myAccountId, myPrivateKey)
client.setDefaultMaxTransactionFee(new Hbar(100))
client.setMaxQueryPayment(new Hbar(50))

router.post('/register', async function (req, res) {
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

// Sample input
// {
//   "encryptedData": "base64_encoded_encrypted_card_data",
//   "expMonth": 12,
//   "expYear": 2024,
//   "billingDetails": {
//     "name": "John Doe",
//     "city": "San Francisco",
//     "country": "US",
//     "line1": "123 Main St",
//     "postalCode": "94103"
//   },
//   "metadata": {
//     "email": "john.doe@example.com",
//     "sessionId": "hashed_session_id",
//     "ipAddress": "192.0.2.1"
//   }
// }

router.post('/anonymousDonate', async function (req, res) {
  const circle = new Circle(
    process.env.CIRCLE_API_KEY,
    CircleEnvironments.sandbox, // API base url
  )

  const {encryptedData, expMonth, expYear, billingDetails, metadata} = req.body

  // Validate the request body to ensure all required fields are provided

  if (!encryptedData || !expMonth || !expYear || !billingDetails || !metadata) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields in request body',
    })
  }

  const idempotencyKey = uuidv4()

  const cardDetails = {
    encryptedData,
    expMonth,
    expYear,
    billingDetails,
    metadata,
  }

  try {
    const response = await circle.cards.createCard(idempotencyKey, cardDetails)
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }

  const cardId = response.data.id

  try {
    const createPaymentResponse = await circle.payments.createPayment({
      idempotencyKey: uuidv4(), // use UUID for idempotencyKey
      metadata: metadata,
      amount: {
        amount: amount.toString(),
        currency: 'USD',
      },
      autoCapture: true, // capture the payment automatically
      verification: 'cvv',
      source: {
        id: cardId, // use the cardId retrieved from the createCard endpoint
        type: 'card',
      },
      description: `Anonymous donation of $${amount} to account ${recipientAccountId}`,
    })

    // Check the payment status
    if (createPaymentResponse.data.status !== 'paid') {
      return res
        .status(400)
        .json({status: 'error', error: 'Payment failed', createPaymentResponse})
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
