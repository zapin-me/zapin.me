![image](https://github.com/user-attachments/assets/aae303c5-df2f-46b6-a84e-cfdcd39057a6)

**zapin.me** is an open-source platform where users can pin messages on a global map, powered by the Lightning Network. Each message is paid for with Satoshis, and the visibility of the message on the map is determined by the amount of Satoshis spent. For every Satoshi you donate, your message stays visible on the map for 10 seconds. This project leverages modern web technologies and a decentralized backend to create an interactive and engaging experience.

## 🌐 Architecture

The architecture of zapin.me is built to ensure scalability, security, and a seamless user experience. Here's an overview:

- **PhoenixD**: A decentralized, secure, and scalable blockchain platform that acts as the backbone of the payment system.
- **Backend**: A REST API built with TypeScript and Express, interacting with the PhoenixD node and managing payment transactions and messages.
- **Frontend**: A Next.js-based web interface that allows users to interact with the map, pin messages, and view the latest activity.

![Architecture](https://github.com/user-attachments/assets/609414f1-ac99-4b4a-9bbb-4ee6d46d6bad)

## 🚀 Quick Start with Docker Compose

### Requirements
Before you begin, ensure you have the following installed:
- Docker
- Docker Compose

### Instructions
Follow these steps to get zapin.me up and running on your local machine:

1. **Clone the Repository:**
    ```bash
    git clone --recurse-submodules https://github.com/MiguelMedeiros/zapin.me.git
    cd zapin.me
    ```

2. **Configure Environment Variables:**

    2.1 For the backend `0_backend/.env`:
    ```env
    PORT=4269
    PHOENIX_TOKEN= (set this to the http-password from 3_phoenixd/phoenix.conf)
    PHOENIX_HOST=http://phoenixd:9740
    ```

    2.2 For the frontend `1_frontend/.env`:
    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:4270
    NEXT_PUBLIC_LIMIT_MESSAGES=100
    ```

3. **Start the Services:**
    Run the following command to build and start the services:
    ```bash
    docker-compose up --build
    ```

4. **Access the Frontend:**
    - Open your browser and go to [http://localhost:3006](http://localhost:3006) to start interacting with the platform.

## 📁 About the 3_phoenixd Directory

The `3_phoenixd` directory contains essential files for running the PhoenixD node. Here's a breakdown of the key files:

- **`phoenix.conf`**: The configuration file for PhoenixD. Make sure to manually copy the `http-password` from this file into the backend's `.env` file as `PHOENIX_TOKEN`.
- **`seed.dat`**: This file contains your seed. It is critical to keep this file secure and backed up.
- **`phoenix.mainnet.`**: The main database file used by PhoenixD. Handle it with care.

## 📝 License

This project is licensed under the [MIT LICENSE](./LICENSE). Feel free to use, modify, and distribute this project, but please retain the original license and attribution.

---

**zapin.me** is not just a project; it's a community effort. Contributions are welcome! If you find this project interesting, consider contributing or sharing your feedback on [GitHub](https://github.com/MiguelMedeiros/zapin.me).

**Let's build something great together!**

