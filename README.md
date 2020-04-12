# TicketChain
IS4302 project repo for Group 2 (4-6pm)

This repo contains the Smart contracts, tests, and the frontend application for our DApp

Please refer to [TicketingBackend](https://github.com/e0014768/TicketingBackend). for the repo for our backend repo.

## Install

### Smart Contracts

1) Run Ganache with port number 8545

`ganache-cli -p 8545`

2) Deploy the contracts

`truffle migrate`

### Frontend

1) Create **both** `.env`and `.env.development` files in the root folder with the following content. Default port number for our backend API is 5000.

#### **`.env`** and **`.env.development`**
``` js
BACKEND_API_URL = http://localhost:5000
```

2) Install the dependencies

`npm install`

3) Start the application

`npm start`
