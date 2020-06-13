import time

import xpring

url = 'test.xrp.xpring.io:50051'
seed = 'ss9unxUg8VgvDjWrogKGVDiRRz97n'
recipient = 'rNJDvXkaBRwJYdeEcx9pchE2SecMkH3FLz'
amount = '10'

print(f'Using rippled node located at: {url}')
client = xpring.Client.from_url(url)

wallet = xpring.Wallet.from_seed(seed)
address = wallet.address

print(f'Retrieving balance for {address}')
balance = client.get_balance(address)
print(f'Balance was {balance} drops!')

print('Sending:')
print(f'- Drops: {amount}')
print(f'- To: {recipient}')
print(f'- From: {address}')
signed_transaction = client.send(wallet, recipient, amount)
client.submit(signed_transaction)

txid = signed_transaction['hash']
print('Hash for transaction:')
print(txid)

time.sleep(5)
transaction_status = client.get_transaction_status(txid)
print('Result for transaction is:')
print(transaction_status.name)
