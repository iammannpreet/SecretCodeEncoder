# SecretCodeEncoder

**SecretCodeEncoder** is an innovative web application that provides a secure and seamless way to encode secret messages and retrieve them using unique identifiers. This project combines a visually immersive front-end experience with a robust and scalable back-end architecture, making it a cutting-edge solution for secure data encoding and retrieval.

## 🚀 Features

- **Dynamic Video Backgrounds:** The front-end utilizes Three.js to implement engaging video backgrounds that adapt seamlessly to user interactions.
- **Interactive Scrolling Experience:** A scroll-to-stay mechanism ensures a smooth transition between virtual pages while maintaining a fluid and intuitive user interface.
- **Secure Data Encoding:** Backend systems encode and store user-provided secret messages, generating a unique identifier for retrieval.
- **Efficient Retrieval:** Clients can use unique identifiers to securely fetch encoded messages from the database.
- **Scalable Architecture:** Designed to handle large-scale user interactions and data with MongoDB as the primary storage solution.

---

## 📂 Tech Stack

### **Frontend**
- **Three.js:** Powers the immersive video backgrounds with precision rendering and seamless animations.
- **Modern UI Components:** Developed using advanced HTML and CSS techniques, optimized for performance and accessibility.
- **Page Scroll Management:** Leveraging Three.js capabilities for a scroll-to-stay feature, enabling users to navigate dynamically within a single-page interface.

### **Backend**
- **Node.js & Express.js:** Provides a robust and modular server-side architecture to handle API requests efficiently.
- **Axios:** Ensures fast and reliable HTTP client requests for external integrations and internal data processing.
- **MongoDB:** Serves as the primary database to store pixel coordinates and secret messages with optimal query performance.

---

## 📜 Usage

### **Encode a Message**
1. Navigate to the **Encode Message** page.
2. Enter your secret message in the input field.
3. Submit the form to receive a unique identifier.

### **Decode a Message**
1. Navigate to the **Retrieve Message** page.
2. Enter your unique identifier in the designated input field.
3. Retrieve your securely stored secret message.

---

## 🔧 Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/iammannpreet/SecretCodeEncoder.git
   cd SecretCodeEncoder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following:
   ```env
   MONGO_URI=<your-mongo-db-uri>
   PORT=5000
   ```

4. Run the backend server:
   ```bash
   npm run server
   ```

5. Start the front-end development server:
   ```bash
   npm start
   ```

---

## 🛠️ API Endpoints

### **POST** `/api/encode`
- **Description:** Encodes a message and generates a unique identifier.
- **Payload:** `{ message: string }`
- **Response:** `{ id: string }`

### **GET** `/api/decode/:id`
- **Description:** Retrieves the encoded message associated with the provided identifier.
- **Params:** `id`
- **Response:** `{ message: string }`

---

## 📁 Folder Structure

```
SecretCodeEncoder/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── Frontend/
│   ├── components/
│   ├── styles/
│   ├── utils/
│   └── main.js
├── .env
├── package.json
├── README.md
└── .gitattributes
```

---

## 🎨 Visual Overview

The front-end interface provides a futuristic design, leveraging Three.js for:
- **Video-rendered backgrounds:** Adding depth and engagement.
- **Scroll management:** Allowing users to interact with multiple functional "pages" within a single view.

---

## 🤝 Contributing

Contributions are welcome! Please submit a pull request or open an issue for feedback.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🛡️ Security

For security concerns or vulnerabilities, please reach out to **vickyarora.singh@gmail.com**.

---

## 🌟 Acknowledgments

Special thanks to the developers and contributors of:
- [Three.js](https://threejs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Axios](https://axios-http.com/)

---

Happy encoding! 🔐
``` 

This document combines technical precision with user-friendly instructions, making it suitable for both developers and end-users. Let me know if you need additional customization!
