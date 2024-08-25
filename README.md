# React + TypeScript + Vite (Frontend-Focused)

## Tech Stack
- React: Frontend framework.
- TypeScript: For static type-checking.
- Vite: For fast builds and development server.
- TailwindCSS: For the visualization
- msw: For mocking the server

## How to Run the Project

### Prerequisites

A. Running with Node.js
Make sure you have Node.js and npm (or yarn) installed.

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. Open your browser and go to `http://localhost:5173`.

B. Running with docker

1. Build the project
    ```bash
    docker build -t image-name .
    ```

2. Run the project
    ```bash
    docker run -d -p 3000:80 image-name
    ```

3. Open the browser and go to `http://localhost:3000`.
