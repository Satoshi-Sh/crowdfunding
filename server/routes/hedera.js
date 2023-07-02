const express = require('express')
const router = express.Router()
const BigNumber = require('bignumber.js')

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  TransactionReceiptQuery,
  Hbar,
  TransferTransaction,
  TransactionId,
  HbarUnit,
  AccountBalanceQuery,
  AccountInfoQuery,
} = require('@hashgraph/sdk')
var {Circle, CircleEnvironments} = require('@circle-fin/circle-sdk')
require('dotenv').config()
const {v4: uuidv4} = require('uuid')
const axios = require('axios')
const {readKey, createMessage, encrypt} = require('openpgp')

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

router.post('/convertToHbar', async function (req, res) {
  const {amount} = req.body
  const hbars = await getHbarEquivalent(amount)
  res.json({hbars: hbars})
})

router.post('/donate', async function (req, res) {
  const {senderPrivateKey, senderAccountId, recipientAccountId, amount} =
    req.body

  // Create the client with sender's account ID and private key
  const client = Client.forTestnet()
  client.setOperator(senderAccountId, senderPrivateKey)
  client.setDefaultMaxTransactionFee(new Hbar(100))

  // Convert the amount in dollars to Hbars
  const hbars = await getHbarEquivalent(amount)
  const hbarsInTinybars = hbars * 100000000 // 1 Hbar = 100,000,000 tinybars
  const amountInTinybars = Math.round(hbarsInTinybars)
  const amountInHbar = Hbar.fromTinybars(amountInTinybars)

  try {
    const transactionId = await new TransferTransaction()
      .addHbarTransfer(senderAccountId, amountInHbar.negated()) // sender's account and the amount to send
      .addHbarTransfer(recipientAccountId, amountInHbar) // recipient's account and the amount to receive
      .execute(client)

    const receipt = await transactionId.getReceipt(client)

    res.json({status: 'success', transactionId: transactionId.toString()})
  } catch (err) {
    res.json({status: 'error', error: err})
  }
})

router.post('/encryptCard', async function (req, res) {
  const {cardNumber, cvc} = req.body
  console.log(process.env.CIRCLE_API_KEY)

  const circle = new Circle(
    process.env.CIRCLE_API_KEY,
    CircleEnvironments.sandbox, // API base url
  )
  const publicKey = await circle.encryption.getPublicKey()
  console.log(publicKey)
  return {}
  const encryptedData = await encryptCardData(cardNumber, cvc, publicKey)
  res.json({encryptedData: encryptedData})
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

  const {
    encryptedData,
    expMonth,
    expYear,
    billingDetails,
    metadata,
    amount,
    recipientAccountId,
  } = req.body

  const publicKey = circle.encryption.getPublicKey()

  const idempotencyKey = uuidv4()

  const cardDetails = {
    encryptedData,
    expMonth,
    expYear,
    billingDetails,
    metadata,
  }
  let cardId
  try {
    const response = await circle.cards.createCard(idempotencyKey, cardDetails)
    cardId = response.data.id
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }

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
      .addHbarTransfer(myAccountId, amountInHbars.negated()) // sender's account and the amount to send
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
  res.json({hbars: balance.hbars.toString()})
})

router.get('/accountInfo/:accountId', async function (req, res, next) {
  const {accountId} = req.params
  const info = await new AccountInfoQuery()
    .setAccountId(accountId)
    .execute(client)
  res.json(info)
})

async function getHbarEquivalent(dollarAmount) {
  const response = await axios.get(
    'https://mainnet-public.mirrornode.hedera.com/api/v1/network/exchangerate',
  )

  const data = response.data

  // cent_equivalent represents the number of cents one hbar is worth
  const centEquivalentPerHbar =
    data.current_rate.cent_equivalent / data.current_rate.hbar_equivalent

  // Convert input dollar amount to cents
  const cents = dollarAmount * 100

  // Convert input cents to hbars
  const hbars = cents / centEquivalentPerHbar

  return hbars
}

async function encryptCardData(number, cvv, publicKey) {
  // Card data to be encrypted
  const cardData = {
    number,
    cvv,
  }

  // Decode the public key
  const decodedPublicKey = await readKey({
    armoredKey: Buffer.from(publicKey).toString('base64'),
  })

  // Create a message from the card data
  const message = await createMessage({text: JSON.stringify(cardData)})

  // Encrypt the message with the public key
  const ciphertext = await encrypt({
    message,
    encryptionKeys: decodedPublicKey,
  })

  // Return the encrypted message
  const encryptedData = {
    encryptedMessage: Buffer.from(ciphertext).toString('utf8'),
    keyId: decodedPublicKey.getKeyId().toHex(),
  }

  return encryptedData
}

module.exports = router
