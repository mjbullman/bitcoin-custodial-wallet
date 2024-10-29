
# Bitcoin Custodial Wallet App

The **Bitcoin Custodial Wallet App** is a custodial wallet application designed to facilitate the purchase of Bitcoin using fiat currency. It consists of a **Node.js** backend API and a **React.js** frontend interface, integrated with Plaid for secure bank account linking and a local regtest Bitcoin node for simulating Bitcoin transactions.

## Project Overview

The app’s backend manages user authentication, bank account linking, and bitcoin transactions, while the frontend provides a user-friendly interface for seamless interaction. Both components are configured for local development, with options to simulate transactions using regtest mode on Bitcoin Core.

---

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for server-side scripting.
- **Express**: Minimal, flexible framework for building backend APIs.
- **Bitcoin Core**: Full node implementation of the Bitcoin protocol (using regtest mode for transaction simulations).
- **Plaid**: API for securely linking user bank accounts in a sandbox environment.
- **SQLite3**: Lightweight SQL database for development and testing.
- **Sequelize**: ORM for interacting with SQLite.

### Frontend
- **React.js**: Frontend framework for building user interfaces.
- **Nuxt.js**: Modern web application framework.
- **Plaid Link**: Plaid’s integration for securely linking user bank accounts.
- **Material-UI**: UI framework for responsive design and React components.

---

## Backend Setup

### Environment Variables

Create a `.env` file in the backend folder with the following variables:
```
BASE_URL=http://localhost:3000
PORT=8080

DATABASE_DIALECT=sqlite
DATABASE_FILE_PATH=database/sqlite/database.db

PLAID_ENV=sandbox
PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID
PLAID_SECRET=YOUR_PLAID_SECRET
PLAID_PRODUCTS=auth,transactions
PLAID_REDIRECT_URL=http://localhost:3000/api/plaid/callback

BITCOIN_PORT=18443
BITCOIN_NETWORK=regtest
BITCOIN_RPC_USERNAME=YOUR_BITCOIN_RPC_USERNAME
BITCOIN_RPC_PASSWORD=YOUR_BITCOIN_RPC_PASSWORD
BITCOIN_CLI_PATH=/path/to/your/bitcoin-cli

JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES=1h
```

### Configure Database

Create the `database.db` file:
```bash
touch backend/database/sqlite/database.db
```

Run DB migrations:
```bash
sequelize db:migrate --config src/config/db.config.json --migrations-path database/migrations
```

### Getting Started 

1. Navigate to the backend folder:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Access the backend API at `http://localhost:8080`.

---

## Frontend Setup

### Environment Variables

Create a `.env` file in the frontend folder with the following variable:
```
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

### Getting Started

1. Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Access the app at `http://localhost:3000`.

---

## Features

### Main Features

- **User Authentication**:
    - Secure email and password login.
    - Session management to keep users logged in.

- **Bank Account Linking**:
    - Plaid Link integration for secure bank account connections.
    - Utilizes Plaid’s sandbox for testing.

- **Bitcoin Purchase Flow**:
    - Allows users to buy bitcoin with fiat.
    - Simulates transactions via a local Bitcoin node.

- **Responsive UI**:
    - Material-UI for optimal UX on desktop and mobile.
    - Intuitive navigation and components.

### Bonus Features

- **Bank Account Balance Check**: Prevents transactions when funds are insufficient.
- **Multiple Bank Account Support**: Allows users to manage and select from multiple bank accounts.

---

## Additional Commands

### Linting

Run linting for backend or frontend:
```bash
npm run lint
npm run lint:fix
```

### Tests

Run backend or frontend tests:
```bash
npm run test
```

---



## License

This project is licensed under the MIT License.
