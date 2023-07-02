# Backend Server for Web3 Fundraising app


## Testing:

### First lets test if our conversion route works
According to coinbase 0.25$ is roughly equal to 5.027 hbars

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"amount\":0.25}" http://localhost:3000/hedera/convertToHbar
```

```json
{"hbars":5.004604235897025}
```
Looks about right!

### Here we simulate a user creating an account, which starts off with 10 Hbars
```bash
curl -X POST http://localhost:3000/hedera/register
```

```json
{"accountId":"0.0.15032471","privateKey":"302e020100300506032b6570042204205f6335f8cc79d3576122f031cad6003658b1ffc3e0b6a090a07e9455fb66247d"}
```

### Another user create a fundraiser, which starts off with 0 Hbars
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"fundraiserId\":\"fundraiser\"}" http://localhost:3000/hedera/createFundraiser
```

```json
{"fundraiserId":"fundraiser","accountId":"0.0.15032472","privateKey":"302e020100300506032b6570042204209689f7af92b244d15f77d506f944ddf2ebd45ffc770140a2488a342c6a015d08"}
```

### The first user donates 0.25$ to the fundraiser
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"senderPrivateKey\":\"302e020100300506032b6570042204205f6335f8cc79d3576122f031cad6003658b1ffc3e0b6a090a07e9455fb66247d\", \"senderAccountId\":\"0.0.15032471\", \"recipientAccountId\":\"0.0.15032472\", \"amount\":0.25}" http://localhost:3000/hedera/donate
```

```json
{"status":"success","transactionId":"{\"nodeId\":\"0.0.6\",\"transactionHash\":\"0a11c6b126d113b03319469769cd2987443098a7888784da70d2c01188c143f8b0e8d48adea8ff678cc152e964dc9be8\",\"transactionId\":\"0.0.15032471@1688289920.634704430\"}"}
```

### We can check the transaction id
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"transactionIdStr\":\"0.0.15032471@1688289920.634704430\"}" http://localhost:3000/hedera/checkTransaction
```
```json
{"status":"SUCCESS"}
```

### Now we can check the balance of the fundraiser, which now contains aronw 0.25$ in Hbars
```bash
curl http://localhost:3000/hedera/balance/0.0.15032472
```
```json
{"hbars":"5.00460424 ℏ"}
```

### Now lets check the details of the fundraiser account
```bash
curl http://localhost:3000/hedera/accountInfo/0.0.15032472
```
```json
{"balance":"5.00460424 ℏ","accountId":"0.0.15032472","contractAccountId":"0000000000000000000000000000000000e56098","isDeleted":false,"proxyAccountId":null,"proxyReceived":"0 tℏ","key":"302a300506032b6570032100afbc78be10458a9f99ab2b26cbfa589278b40a4377d60310a24a85db806524bc","sendRecordThreshold":"0 tℏ","receiveRecordThreshold":"0 tℏ","isReceiverSignatureRequired":false,"expirationTime":"1696065562.0","autoRenewPeriod":"[object Object]","accountMemo":"","ownedNfts":"0","maxAutomaticTokenAssociations":"0","aliasKey":null,"ledgerId":"testnet","ethereumNonce":"0","stakingInfo":{"declineStakingReward":false,"stakePeriodStart":null,"pendingReward":"0 tℏ","stakedToMe":"0 tℏ","stakedAccountId":null,"stakedNodeId":null}}
```
### We can also check the balance of the donor, which is now slightly less 10 - 5.00460424 due to transaction fees
```bash
curl http://localhost:3000/hedera/balance/0.0.15032471
```

```json
{"hbars":"4.99337772 ℏ"}
```

### Now lets start testing circle
First testing encrypting a dummy card number and cvc provided by Circle

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"cardNumber\":\"4007400000000007\",\"cvc\":\"123\"}" http://localhost:3000/circle/encryptCard
```

```json
{"encryptedData":{"encryptedMessage":"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFnQW92ZncvZTFBcEJ6enUyNTk3ZSt4MzhSc0RzaC9SVUVTZWJUNVQrSk4KME9yd085bi9hZS9nTGVkblpPS1I3WlNpVWx1d0dDWWNjSDdtekhBWTNTQXFRblFLaGVOMVV5TlRPTHZ1CktzWU4vUmtyN3dXZWVQMWd0NHFpL21NMWFvWWFQY3QxMlI4NXdxN1VaZlAwalpLcXBqTHU2OHYzQjBSQwp1RmFKYUF6cnliUzE5VXFuRi8rUVZpUHlkY1FMblVEQXJHYjdrYXFuUnNNdkFTSkNwNHg0SkcxTGFObHMKTlJ0UVNWZTBaRlNkVWNzSkNUS2FHUTk3N2ZIZW9VOU96djBMUmxxQ2lvZU5YWWJROG5Yem9ZdGtoaWNwCjRJd0REUTN0Q1RBUUtITE9WeXIzb0ZIZTVXSm8zOUJFdS82aWZWM3Z6bFZrWnZNNWlROHVLdEwxV1EveQpCTkphQWNDVU9EZlhUMzA0YVdEemRGYjRwM3hKcWF6ZHZXODczVXZmNHdFM1dhYUZTbVEyRjI0ajNJY2sKM2dLSVRzSkxSVnN3QUFuTFZ2NU15cEJOMGFYdVBZcVc4RmlOUXZmajFUWGlwYVJQMGRRUXd2ZUQ4aW11CldsR1QKPU9NN2gKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo=","keyId":"key1"}}
```

### Donating 5$ to the fundraiser with a dummy card number and cvc.

5$ is around 99.6810207336523 Hbar now
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"number\": \"4007400000000007\", \"cvc\": \"123\", \"expMonth\": 12, \"expYear\": 2024, \"billingDetails\": {\"name\": \"John Doe\", \"city\": \"San Francisco\", \"country\": \"US\", \"line1\": \"123 Main St\", \"postalCode\": \"94103\", \"district\":\"CA\"}, \"metadata\": {\"email\": \"john.doe@example.com\", \"sessionId\": \"hashed_session_id\", \"ipAddress\": \"192.0.2.1\"},\"amount\": 5, \"recipientAccountId\":\"0.0.15032472\"}" http://localhost:3000/circle/anonymousDonate
```

```json
{"status":"success","transactionId":"{\"nodeId\":\"0.0.6\",\"transactionHash\":\"3c7e8cdfcc67a7df0a89ca5bf6b833371258e55b36acf99055b563f395bc29da4f526f6d386b390d6fc000aa356d4c5d\",\"transactionId\":\"0.0.15028047@1688300897.106887451\"}"}
```

### Finally, lets check the fundraiser account again

Last time, it had 5 hbars, now it should have around 105 hbars, which is around 5.25$ in USD
And this makes sense because we first donated 0.25$ to the fundraiser, and then 5$ to the fundraiser

```bash
curl http://localhost:3000/hedera/balance/0.0.15032472
```

And it works~
```json
{"hbars":"105.15215496 ℏ","usd":"5.25"}
```