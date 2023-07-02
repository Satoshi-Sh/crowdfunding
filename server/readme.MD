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