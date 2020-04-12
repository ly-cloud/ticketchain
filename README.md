# TicketChain
IS4302 project repo for Group 2 (4-6pm)

This repo contains the Smart contracts, tests, and the frontend application for our DApp

Please refer to [TicketingBackend](https://github.com/e0014768/TicketingBackend) for our backend repo.

## Install

### Smart Contracts

1) Run Ganache with port number 8545

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ganache-cli -p 8545`

2) Deploy the contracts

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`truffle migrate`

### Frontend

1) Create **both** `.env`and `.env.development` files in the root folder with the following content. Default port number for our backend API is 5000.

#### **`.env`** and **`.env.development`**
``` js
BACKEND_API_URL = http://localhost:5000
```

2) Install the dependencies

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`npm install`

3) Start the application

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`npm start`
