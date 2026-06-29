# Open chat (Frontend - React)

## Overview
Open chat frontend is an app for instant messaging and video calling.

---

## Features
 - User login and authentication UI
 - Real-time chat interface
 - Video calling using WebRTC
 - Incoming call popup UI
 - Reponsive design

---

## Tech stack

- React v19
- WebRTC
- Context API
- Pusher client

---

## Client side window architecture

### 1. User authentication window
<details>
<summary><b>View architecture: session lifecycle</b></summary>

```mermaid
graph LR
    A[React client UI] -->|1. Submit credentials| B(fetch request)
    B -->|2. HTTPS POST /user/login| C[External Laravel API]
    C -->|3. Return bearer token| B
    D -->|4. Returns response with http cookie attached| A
```
#### Visual proof
<p align="center">
    <img src="screenshots/login.png" alt="Login Interface" width="700" />
</p>
</details>

---

## Installation

1. Clone the repository
```git clone https://github.com/progssp/open_chat_frontend.git
cd open_chat_frontend```
   
2. Install dependencies
```npm install
npm run start```

3. browse the app via http://localhost:3000