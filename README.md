# Card Drafting App

This project is a web application to generate and draft Magic the Gathering cards. It uses OpenAI GPT for card generation and DALL-E for artwork generation. The frontend is built with Vue.js and the backend is powered by Node.js with Express and MongoDB.

## Project Setup

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- OpenAI API key

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/chicagopolitics/card-drafting-app.git
    cd card-drafting-app
    ```

2. Install backend dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root of the project and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

4. Start MongoDB (if not already running):
    ```sh
    mongod
    ```

5. Start the backend server:
    ```sh
    node server.js
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd card-drafting-app
    ```

2. Install frontend dependencies:
    ```sh
    npm install
    ```

### Compiles and Hot-Reloads for Development

To run the frontend in development mode with hot-reloading:
```sh
npm run serve
