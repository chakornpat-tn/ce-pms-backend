# Project Name

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (Recommended to use the latest version)
- [pnpm](https://pnpm.io/installation) (For package management)

## Installation

### Installation Steps

1. **Install Node.js**: Download and install Node.js from [Node.js Official Website](https://nodejs.org/en/download/).

2. **Install pnpm**: After installing Node.js, install `pnpm` using the following command:
    ```bash
    npm install -g pnpm
    ```

3. **Clone the Project**: Clone your project using:
    ```bash
    git clone https://github.com/chakornpat-tn/ce-pms-backend.git
    cd ce-pms-backend
    ```

4. **Install Dependencies**: Use `pnpm` to install the required packages:
    ```bash
    pnpm install
    ```

5. **Set up Prisma**:
    - Create the `.env` file and set your `DATABASE_URL`:
        ```bash
        cp .env.example .env
        ```
    - Edit the `.env` file to set your `DATABASE_URL`:
        ```env
        DATABASE_URL="your-database-connection-string"
        ```
    - Generate the Prisma client:
        ```bash
        pnpm prisma generate
        ```
    - Apply migrations to create tables in your database as defined in `schema.prisma`:
        ```bash
        pnpm prisma migrate dev --name init
        ```
        > **Note:** `--name init` is used to name the initial migration. You can change this name as needed.

6. **Run the Project**: After setting up everything, you can start the project using:
    ```bash
    pnpm run dev
    ```
    Your project will start running and be accessible at the URL displayed in the terminal.

### Additional Commands

- **Prisma Studio**: Launch Prisma Studio to view and manage data in your database:
    ```bash
    pnpm prisma studio
    ```
- **Run Migrations**: To update the database structure:
    ```bash
    pnpm prisma migrate dev
    ```