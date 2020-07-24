
class: middle, center
# Notarization on Tezos
.subtitle[ using TZIP12 token contracts]
<br>

.subtitle[presented by Stove Labs👨‍🍳]

.right[
Twitter: @stove_labs

Telegram: t.me/stove_labs

Discord: invite.gg/stove-labs
]

---

## Matej Sima & István Deák

.center[<img src="./static/group.jpeg" style="width: 100%" />]

---

class: center, middle

# Stove Labs

Blockchain, IPFS, ReasonML, Smart Contracts, Open-source, DAPPs, Tutorials and more.

---

background-image: url(./static/workshops.jpg)


---

## What will you learn with us?

* Make sense of a real-life .bg-nord13[.nord1[use case: notarization]] with Blockchain
* Understand the basics of the .bg-nord13[.nord1[Tezos blockchain]] platform
* .bg-nord13[.nord1[Design, implement]] and .bg-nord13[.nord1[test]] smart contracts
* Perform tests on a private network
* .bg-nord13[.nord1[Deploy smart contracts]] to the public test network Carthage
* .bg-nord13[.nord1[Interact]] with smart contracts from a browser programmatically

---

## Workshop Agenda

### Day 1

1. Introduction to the use case: Document notarization 2.0        
2. Tezos protocol overview
3. Technology stack used in this workshop
4. Setting up the workstation
5. Crash course: using Ligo for smart contracts
6. High level overview of the solution 

### Day 2

7. Similarities of notarization and asset creation/tokenization
8. Understanding TZIP-12  standard for multi-asset contracts
9.  Extending TZIP-12 for notarization
10. Deploying and testing with Truffle 
11. Connecting the notarization user interface to the smart contract

---


class:  center, middle

## Introduction to the use-case
# Document notarization 2.0

---
background-position: center
background-size: contain
background-repeat: no-repeat
background-image: url(./static/notary.jpg )

## .bg-nord1[What is notarization?]


---

### Notary .bg-nord13[.nord1[witnesses]] the signature of important documents and .bg-nord13[.nord1[puts]] a seal or stamp on documents:

1. .bg-nord13[.nord1[lease agreement]] : tenant and landlord 
--

2. license agreement: author and publisher
--

3. SLA: provider and consumer
--

4. intellectual property rights: inventor(s) 



---



## History

- ~3200 B.C. ledgers in clay recording crops
- tracking movement in and out of storehouses
- early financial payment recordings
- 300 A.D. Roman Egypt: Heroninos Archive: real estate 
- act of buying and selling
- .bg-nord13[.nord1[transactions]] between parties result in change of records

.right-column[ <img src="./static/old_clay_tablet.jpeg" style="width: 80%" />]

---

# Ledgers are like excel sheets

- .bg-nord13[.nord1[keep track of balances]] of various *assets* 
  - crop
  - real estate
  - bonds(debt)
  - money

.right-column[
<img src="./static/ledger.jpeg" style="width: 70%" />
]

[image source](https://miro.medium.com/max/1000/1*_-mG1aVOmIO9sChDO9A0ew.jpeg)




---
class: center, middle

# Ledgers are like excel sheets
.center[
| Transaction | From-To| Asset |
| :---: | --- | --- |
| 1 | Alice -> Bob | €10 |
| 2 | Bob -> Charly | €5 |
| 3 | Charly -> Alice | €3 |
]

---

# Digital ledgers

- speed and scale like never in history
- challenges
	- information almost no cost to copy
	- difficult to audit changes
- makes a big difference eg. account balances at banks
- strategy to restrict copying and access


--- 

# Digital ledgers with Blockchain 

- 180° shift in approach
- copying is endorsed
- decentralized
	- every participant has its own copy
	- publicly accessible and verifiable 
	- rules in how to execute changes, transactions, can be codified in smart contracts
	- trustless environment

---

# Notaries today

- political authority through governments
- .bg-nord13[.nord1[screen true identities]] of the .bg-nord13[.nord1[signees]]
- willingness of signees to sign without pressure, intimidation (duress)
- keep their own records and protocols of transactions (witnessed contracts)

---
background-position: center
background-size: contain
background-repeat: no-repeat
background-image: url(./static/notary_humor_shark.jpeg)

---
class: center, middle

#  Alice and Bob
## are doing business together 


---

# Our use-case: renting an old factory 🏭

- Alice and Bob want to enter a commercial lease agreement 
- Bob wants to rent a factory in an industrial area
- custom contract
- finalizing at notary 
.right-column[
![right](./static/factory.png)
]
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<small>[image source](https://de.wikipedia.org/wiki/Fabrik#/media/Datei:Airacobra_P39_Assembly_LOC_02902u.jpg)</small>


---

# A structured approach to any use-case

1. .bg-nord13[.nord1[Actors]]: Obviously this is aimed to answer the question: "Who is taking part in the system?". This becomes particularly important, when defining the governance of the solution.
--

2. .bg-nord13[.nord1[Data]]: "What form or medium does the information take?" 

--

1. .bg-nord13[.nord1[Process]]: "What is are the business processes at hand?"


---

# Actors 


<img src="./static/actors.png" style="width: 100%" />
---

# Data

- Two paper copies of the same *lease-agreement contract* 
- *hand signatures* of Alice and Bob 
- *stamp* of the notary

.right-column[
<img src="./static/notary_public.jpg" style="width: 60%" />
]

---
# Process

<img src="./static/process.png" style="width: 80%" />
---


# Alice and Bob 
### same goal, different process with blockchain


- outsource the .bg-nord13[.nord1[witnessing to blockchain]], instead of political authorities
--

- .bg-nord13[.nord1[time-stamp document fingerprints]] in the immutable blockchain ledger
--

- .bg-nord13[.nord1[enable multiple people to sign]] through smart contracts

--

- by pre-defining a number of shares or .bg-nord13[.nord1[shards]]

--

- that can be *claimed* by co-signers and completes the notarization

---
## Let's explore the process using blockchain

<img src="./static/blockchain_process.png" style="width: 75%" />


---


# The website - next generation with Web 3.0 


```
	      ▲                                           
	      │                                           
	  complexity                                      
	      │                          web 3.0          
	      │                             *             
	      │                                           
	      │                                           
	      │                                           
	      │          web 2.0                          
	      │             *                             
	      │                                           
	      │  web 1.0                                  
	      │     *                                     
	      │                                           
	      └────────────────────────────────▶ time     
	         ┌────┐  ┌────┐          ┌────┐           
	         │1990│  │2000│          │2020│           
	         └────┘  └────┘          └────┘     
```

---
class: middle

.center[<img src="./static/web_generations.png" style="width: 120%" />]


---

# How it is done today:  Web 2.0 

```
┌────Web─Browser───┐                      ┌────Web─Server────┐
│                  │─────URL request─────▶│                  │
│                  │                      │                  │
│                  │    response w/ web   │                  │
│                  │ ◀───page + assets────│                  │
│                  │                      │                  │
│       www        │                      │   centralized    │
│                  │      request         │                  │
│                  │───read or write────▶ │                  │
│                  │                      │                  │
│                  │                      │                  │
│                  │◀──────response───────│                  │
└──────────────────┘                      └──────────────────┘

        
```


---


# Solutions of tomorrow: Web 3.0
```
		┌────Web─Browser───┐                      ┌────Web─Server────┐
		│                  │─────URL request─────▶│                  │
		│                  │    response w/ web   │    centralized   │
		│                  │ ◀───page + assets────│                  │
		│       www        │                      └──────────────────┘
		│                  │      request         ┌────Blockchain────┐
		│                  │───read or write────▶ │                  │
		│                  │                      │  decentralized   │
		│                  │◀──────response───────│                  │
		└──────────────────┘                      └──────────────────┘
		      prepares                                      ▲            
		          ▼                                         │         
		┌──────────────────┐                                │         
		│     "write"      │                                │         
		│   transaction    │────────new write request───────┘         
		└──────────────────┘                                          
		          ▲                                                   
		        signs                                                 
		┌──────────────────┐                                          
		│Plugin with       │                                          
		│keychain/wallet   │                                          
		└──────────────────┘    
```


---

# Drag & drop for the document's fingerprint - hashing

```sh
sha256 is a type of SHA-2 (Secure Hash Algorithm 2)


sha256('never trust a skinny chef') = 

36d87a683cfb033dcdb751723d5ef32085988716ce87a30c4ee3844992510a6a

sha256('never trust a skiny chef')  = 

40526579889ed880ceac08478fff0fc7dec022dd5843725b1fb3a26ea1f8a62f
```


---

# Good to know about hashing

1. .bg-nord13[.nord1[deterministic]] - the same input always returns the same output hash
   
--

1. .bg-nord13[.nord1[uncorrelated]] - a small change in the message generates a completely different hash

--
2. .bg-nord13[.nord1[unique]] - it is infeasible for two different messages to generate the same hash

--
3. .bg-nord13[.nord1[one-way]] - it is infeasible to calculate or guess the input from the output hash




---

# Accounts and smart contracts in Tezos

Every Tezos address starts with `tz` followed by either `1`,`2` or `3` and the *hash of the public key*.

	                                      elliptic curve                                      
	┌─────────────┐ hashing  ┌─────────── multiplication ───────────┐ hashing  ┌─────────────┐
	│             │━━━━━━━━━▶│             │━━━━━━━━━▶│             │━━━━━━━━━▶│             │
	│    Seed     │          │ Secret Key  │          │ Public Key  │          │   Address   │
	│             │◀x x x x x│(Private Key)│◀x x x x x│             │◀x x x x x│             │
	└─────────────┘          └─────────────┘          └─────────────┘          └─────────────┘

```
pkh = public key hash,
sk = secret key,
pk = public key

alice: {
        pkh: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        sk: "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq",
        pk: "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn"
    }
```


---


# Smart contracts start with `KT1`

Here's an example of Michelson code: 

```
{ parameter (or (or (nat %add) (nat %sub)) (unit %default)) ;
  storage int ;
  code { AMOUNT ; PUSH mutez 0 ; ASSERT_CMPEQ ; UNPAIR ;
         IF_LEFT
           { IF_LEFT { ADD } { SWAP ; SUB } }
           { DROP ; DROP ; PUSH int 0 } ;
         NIL operation ; PAIR } }
```

--

- .bg-nord13[.nord1[parameter]] - An argument that is provided by a transaction invoking the contract.

--

- .bg-nord13[.nord1[storage]] - The type definition for the contract's data storage.

--

- .bg-nord13[.nord1[code]] - The actual Michelson code, that has the provided parameter & the current storage value in it's initial stack, and outputs a list of operations & a new storage value as it's resulting stack.

> We will be later using and modifying a smart contract that follows the .bg-nord13[.nord1[TZIP12 token specification]].

---
# Completing the data

Alice specifies a number of .bg-nord13[.nord1[shards]] that represent a fraction of the contract. In the notarization process she specifies how many of those shards belong to Bob and need .bg-nord13[.nord1[claimed]] to complete the process.

> While this might be trivial for a 2 person notarization, this approach has many benefits for more complex notarizations. Change of ownership, multi-party with unequal *rights* and representation of those in the immutable ledger is a game changer!

---
exclude: true

# How it comes together


```
	┌─────ledger─entry────┐                                         ┌─────ledger─entry────┐  
	│{                    │                                         │{                    │  
	│    hash:            │   after    ┌────────────────┐  after    │    hash:            │  
	│    [                │   create   │                │  update   │    [                │  
	│        Alice: true, │◀══════════ │    storage     │══════════▶│        Alice: true, │  
	│        Bob: false   │            │                │           │        Bob: false   │  
	│    ]                │            └────────────────┘           │    ]                │  
	│}                    │                ▲           ▲            │}                    │  
	└─────────────────────┘                │           │            └─────────────────────┘  
	                                    creates     updates                                  
	                                       │           │                                     
	                              ┌─────────────────────────────┐                            
	                              │                             │                            
	                              │       Smart Contract        │                            
	                              │      (business logic)       │                            
	                              │                             │                            
	                              └─────────────────────────────┘                            
	                                        ▲             ▲                                  
	                                        │             │                                  
	                             creating shards        transaction                             
	                              w/ transaction      claiming shards                             
	                            containing hash        for given hash                             
	                                   │                  │                                  
	                                   │                  │                                  
	┌──hashing─func──┐           ┌──Account──┐      ┌──Account──┐          ┌──hashing─func──┐
	│                │           │           │      │           │          │                │
	│sha256(document)│ ───hash──▶│   Alice   │      │    Bob    │◀──hash───│sha256(document)│
	│                │           │           │      │           │          │                │
	└────────────────┘           └───────────┘      └───────────┘          └────────────────┘

```
---

## High level overview of the solution 👨‍🍳

<img src="./static/high-level.jpg" style="width: 100%" />

---

class: center, middle

## Comparing old & new

.center-table[
|                | **current**                       | .bg-nord13[.nord1[digital future]]                    |
|:--------------:|-------------------------------|-------------------------------------|
|     **where**  | at notary's office            | remotely from anywhere     👍         |
|      **what**     | two copies of paper           | digital doc - unique hash  👍    |
| **identification** | government issued    👍         | private key                         |
|  **comprehension** | notary checks        👍         | missing                             |
|     **signing**    | signing by hand               |  cryptographic signature  👍   |
|    **validity**    | notary's stamp on 2 papers    | included in a block          👍       |
|     **witness**    | notary                        | decentralised blockchain      👍      | 
]

---

class:  center, middle

## Stack used in this workshop

---
class:  center, middle

## Setting up the workstation
### Break-out session

---

class:  center, middle

## Crash course: Getting started with ReasonLigo
### Break-out session

---
# Notarization Workshop
### Day 2

1. .bg-nord13[.nord1[Similarities]] of .bg-nord13[.nord1[notarization]] and asset creation/.bg-nord13[.nord1[tokenization]]
1. Understanding .bg-nord13[.nord1[TZIP-12 standard]] for multi-asset contracts
1. .bg-nord13[.nord1[Extending]] TZIP-12 for notarization
1. .bg-nord13[.nord1[Deploying and testing]] with Truffle 
1. Connecting the notarization user interface to the smart contract

---

class: center, middle

# Using token contracts for notarization
---

# Various approaches to notarization

Early versions or "notarization 1.0":
- times-stamp of a document hash in an immutable ledger
- proof that the document existed at time **T**

Features of notarization "2.0":
- multi-party ownership of notarization
- transfer of ownership (consider selling a car and transferring its papers)
- holding a fraction of shares or "shards" of the notarized asset

---

class: center, middle

# TZIP12 multi-asset token contract

---

# Assets

Generally speaking, can be fungible and non-fungible.

.bg-nord13[.nord1[Fungible]]: every representation the same (eg. currencies, commodities such as coffee, oil etc.)

.bg-nord13[.nord1[Non-fungible]]: unique, rare, collectible (eg. tickets, game items)

---
# TZIP12 or FA2 (Financial Application)

In the Ethereum ecosystem dominant designs emerged:

- ERC-20 (fungible tokens) and ERC-721 (non-fungible tokens)
- Standards evolved to ERC-1155 to support multiple token types in one.

TZIP12 supports multiple types.

---
# TZIP12
A token contract implementing the FA2 standard MUST have the following entrypoints:

```ocaml
type fa2_entry_points =

| Transfer of transfer list
| Balance_of of balance_of_param
| Update_operators of update_operator list
| Token_metadata_registry of address contract
```
<br>

> 👨‍🍳 How tokens are created/minted is up to the use-case and the to be implemented business logic.


---
# TZIP12 for notarization

Important to implement a permission behavior, where parties acknowledge the notarization through some transaction. In our solution, we use the concept of .bg-nord13[.nord1[claiming of shards]] in order to complete the notarization process.

In other words, the initiator follows the following steps in the context of TZIP12:
1. Specify the document hash, number of shards, shards distribution according to addresses (co-signers)
--

2. Launch of contract
--

3. Token balances are in a transitive state, until all shards are claimed

--
4. Co-signers claim shards
   1. Business logic within the contract checks whether all shards had been claimed

--
5. All shards claimed initiates the distribution of tokens to respective addresses

--
6. Final state had been reached and notarization is complete

---

<img src="./static/overview.png" style="width: 100%" />

---

class: middle, center

# Recap Entrypoints

---


# Entrypoints

Looking at a smart contract as a collection of functions that share and manipulate the same storage.

When interacting with the smart contract, the submitted parameters arrive at the main function of the code.

How to address specific functions inside the contract by calling it from the "outside"?

.bg-nord13[.nord1[Entrypoints]] match variants of the parameters and route it to the desired function.

<br>

> 👨‍🍳 Entrypoints make functions explicitly callable from the outside of a smart contract.

---

# Entrypoints

From day 1: Counter contract 
```reason 
type storage = int;
type parameter =
| Increment(int)
| Decrement(int)

let main = ((parameter, storage): (parameter, storage)): (list(operation), storage) => {
  let storage = switch (parameter) {
| Increment(i) => storage + i
| Decrement(i) => storage - i
  };
  (([]: list(operation)), storage);
};

```

Then used the online editor to `dry-run` and passed .bg-nord13[.nord1[`Increment(10)`]] as .bg-nord13[.nord1[`parameter`]].

---

Our contract of this workshop will expose:
```reason

type tzip12Parameter = 
| Transfer(transferParameter)
| BalanceOf(balanceOfParameterMichelson)
| Token_metadata_registry(tokenMetadataRegistryParameter)

type notaryParameter = 
| Shard(shardParameter)
| Claim(claimParameter)

type parameter = 
    | TZIP12_(tzip12Parameter)
    | Notary(notaryParameter)
```

---
# Notary

```reason
type shardOwner = address;
type shards = map(shardOwner, shardCount);
type shardOwners = set(shardOwner);

type shardParameter = {
    documentHash: documentHash,
    totalShards: shardCount,
    shardOwners: shardOwners,
    shards: shards
};

type claimParameter = documentHash;

type notaryParameter = 
| Shard(shardParameter)
| Claim(claimParameter)
```

---
# TZIP12_

#### Transfer parameters

```reason
type transferContents = {
    to_: tokenOwner,
    token_id: tokenId,
    amount: tokenAmount
};
type transferContentsMichelson = michelson_pair_right_comb(transferContents);

type transferAuxiliary = {
    from_: tokenOwner,
    txs: list(transferContentsMichelson)
};

type transferMichelson = michelson_pair_right_comb(transferAuxiliary);
type transferParameter = list(transfer);

type tzip12Parameter = 
| Transfer(transferParameter)
| BalanceOf(balanceOfParameterMichelson)
| Token_metadata_registry(tokenMetadataRegistryParameter)

```

---
# TZIP12_
#### BalanceOf parameters

```reason
type balanceOfRequest = {
    owner: tokenOwner,
    token_id: tokenId,
};
```
<small>*simplified without showing transformations</small>

---
# TZIP12_
#### Token metadata registry 

```reason
type tokenSymbol = string;
type tokenName = string;
type tokenDecimals = nat;
type tokenExtrasKey = string;
type tokenExtrasValue = string;
type tokenExtras = map(tokenExtrasKey, tokenExtrasValue);

type tokenMetadata = {
    token_id: tokenId,
    symbol: tokenSymbol,
    name: tokenName,
    decimals: tokenDecimals,
    extras: tokenExtras
};
```

---

class: middle, center

# Extending TZIP-12 for notarization

---
class: middle, center

# Deploying and testing with Truffle 

---

class: middle, center

# Connecting the notarization user interface to the smart contract
