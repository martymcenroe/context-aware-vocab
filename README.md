# Context-Aware Vocabulary Tool

A full-stack, AI-powered browser extension to provide in-context definitions and cultural analysis for highlighted words, built on a secure, serverless AWS backend.

This project serves as a portfolio piece demonstrating a complete, cloud-native application lifecycle, from client-side JavaScript to a secure, scalable GenAI backend.

## Features

* **Browser Extension:** A clean, lightweight Chrome extension (Manifest V3) that adds a "Explain with AI" item to the right-click context menu.
* **Secure API Backend:** A serverless backend that is *not* a toy. The API is protected from financial risk and abuse using **API Gateway (REST)** with **API Keys** and **Usage Plans** (quotas and throttling).
* **GenAI Core:** The backend is designed to call **Amazon Bedrock** to provide deep, context-aware analysis of the highlighted text, not just a simple dictionary definition.
* **Scalable Database:** Uses **DynamoDB** for logging requests and responses, built to scale.

## Architecture

This project is built on a decoupled, serverless architecture.

### 1. Frontend: Browser Extension

* **Technology:** `JavaScript` (Manifest V3)
* **Workflow:**
    1.  User double-clicks a word and right-clicks to select "Explain with AI".
    2.  The extension's `service-worker.js` captures the `selectionText` and `pageUrl`.
    3.  A `fetch` call is made to the secure API Gateway endpoint, passing the `x-api-key` in the header.

### 2. Backend: AWS Serverless

* **Technology:** `API Gateway`, `Lambda (Python)`, `DynamoDB`
* **Workflow:**
    1.  **API Gateway (REST API)** receives the `POST /lookup` request.
    2.  It authenticates the request using the **API Key** and checks it against the **Usage Plan**.
    3.  If valid, it triggers the **Lambda** function (`processVocabularyRequest`).
    4.  The **Python Lambda** function:
        * Parses the request body.
        * (Future) Prepares a prompt and calls **Amazon Bedrock** for analysis.
        * (Future) Performs a **RAG** lookup against a vector database like **ChromaDB** or **Pinecone**.
        * Writes the request and response to **DynamoDB**.
        * Returns a JSON response to the browser.

![Architecture Diagram](httpsDELETETHIS://via.placeholder.com/800x400.png?text=API+Gateway+->+Lambda+->+DynamoDB/Bedrock)
*(Note: You can create and upload a real diagram here later)*

## Technology Stack

This project leverages a modern, professional stack tailored for AI and cloud-native development.

| Category | Technology |
| :--- | :--- |
| **Cloud** | Amazon Web Services (AWS) |
| **Compute** | AWS Lambda (Python) |
| **API** | AWS API Gateway (REST API) |
| **Database** | AWS DynamoDB (NoSQL) |
| **GenAI** | Amazon Bedrock (Claude, Llama) |
| **AI Framework** | LangChain, LangGraph (for future RAG pipeline) |
| **Vector DB** | ChromaDB, Pinecone (for future RAG pipeline) |
| **Client** | JavaScript (Chrome Manifest V3) |
| **Security** | API Keys, Usage Plans, IAM Roles |
| **DevOps** | Git, GitHub, VSCode |

## Setup & Deployment

This project is managed in two parts.

### Backend (AWS)

1.  **Database:** Create a `DynamoDB` table with a primary key.
2.  **Logic:** Create a `Lambda` function (Python) with an IAM role granting it DynamoDB write access.
3.  **API:** Create a `REST API` in **API Gateway**.
4.  **Security:**
    * Configure the `POST /lookup` method to require an **API Key**.
    * Create a **Usage Plan** with throttling and quotas.
    * Create an **API Key** and associate it with the Usage Plan.
    * Deploy the API to a stage (e.g., `v1`) and link the stage to the Usage Plan.

### Frontend (Browser Extension)

1.  Clone this repository.
2.  Create a `config.js` file in the root (this file is in `.gitignore` and must not be committed).
3.  Add your API URL and Key to `config.js`:
    ```javascript
    const CONFIG = {
      API_URL: "[https://YOUR-ID.execute-api.us-east-1.amazonaws.com/v1/lookup](https://YOUR-ID.execute-api.us-east-1.amazonaws.com/v1/lookup)",
      API_KEY: "YOUR_API_KEY_HERE"
    };
    ```
4.  Open Google Chrome, navigate to `chrome://extensions`.
5.  Enable "Developer mode".
6.  Click "Load unpacked" and select this project's directory.