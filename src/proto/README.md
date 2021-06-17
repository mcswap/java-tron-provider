TODO: create the transaction hex data client side so that using an
untrusted tron node is possible

https://github.com/opentron/opentron/tree/master/proto2/proto

signed data is Transaction.Raw

https://github.com/opentron/opentron/blob/master/proto2/proto/chain.proto#L169

uhhh... tronweb trusts whatever hex data the tron node returns!!

the transaction hex to be signed is returned from the tron node server and isn't verified at all, which means a malicious tron node could return a transaction that spends all the victims TRX to a hacker controlled address https://github.com/TRON-US/tronweb/blob/master/src/lib/trx.js#L904-L905
