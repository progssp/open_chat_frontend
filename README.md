# Open chat (Frontend - React)

## Demo link
[![](https://img.shields.io/badge/Demo%20link-2563eb)](https://open-chat-frontend-alpha.vercel.app/app)

---

## Back end repo link
[![](https://img.shields.io/badge/Backend%20repo%20link-2563eb)](https://open-chat-frontend-alpha.vercel.app/app)

---

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
graph TD
    StartNode([START]) --> A[React client UI] -->|1. Submit credentials| B(fetch request)
    B -->|2. HTTPS POST /user/login| C[External Laravel API]
    C -->|4. Returns response with http cookie attached| A
    A --> |5. subscribing to pusher private channel| D(Pusher)
    D --> |6. returns auth string and socket id| A
    A --> EndNode([STOP])
```
#### Visual proof
<p align="center">
    <img src="screenshots/login.png" alt="Login Interface" width="700" />
</p>
</details>

---

### 2. User chat window
<details>
<summary><b>View architecture: chat loading lifecycle</b></summary>

```mermaid
graph TD
    A[React client UI] -->|1. Clicks user chat| B(fetch request)
    B -->|2. HTTPS POST /user/get-one-to-one-messages or /user/get-group-messages| C[External Laravel API]
    C -->|4. Returns response| A
```
#### Visual proof
<p align="center">
    <img src="screenshots/chatting_window.png" alt="Chat Interface" width="700" />
</p>
</details>

---

### 3. User call window
<details>
<summary><b>View architecture: video/audio call lifecycle</b></summary>

```mermaid
graph TD
    A[Caller UI] -->|1. Clicks call button & sends call request| B(Pusher)
    B -->|2. broadcast call request to callee| C[Callee UI]
    C --> Choice{Does callee accept?}
    Choice --> |send reject call| B
    B --> |3. broadcast reject call| A
    Choice --> |send accept call| B
    B --> |4. broadcast accept call| A
```
#### Visual proof
<p align="center">
    <img src="screenshots/call_popup.png" alt="Call Popup Interface" width="700" />
    <img src="screenshots/call_preview.png" alt="Call Preview nterface" width="700" />
</p>
</details>

---

### 4. User create group window
<details>
<summary><b>View architecture: create group lifecycle</b></summary>

```mermaid
graph TD
    A[Client UI] -->|1. Clicks create group button| B(Create group popup 1 appears)
    B -->|2. on form submit with data| C[External API]
    C --> |3. returns reponse| B
    B --> |4. next popup trigger| D(Create group popup 2 appears)
    D -->|5. on form submit with users data| C[External API]
    C --> |3. returns reponse| D
```
#### Visual proof
<p align="center">
    <img src="screenshots/create_group_popup1.png" alt="Call Popup Interface" width="700" />
    <img src="screenshots/create_group_popup2.png" alt="Call Preview nterface" width="700" />
</p>
</details>

---

### 5. User edit profile window
<details>
<summary><b>View architecture: edit profile lifecycle</b></summary>

```mermaid
graph TD
    A[Client UI] -->|1. Clicks edit profile button| B(Edit profile popup appears)
    B -->|2. on form submit with data| C[External API]
    C --> |3. returns reponse| B
```

</details>

---

## Installation

 -- Clone the repository by typing command ```git clone https://github.com/progssp/open_chat_frontend.git```

 -- ```cd open_chat_frontend```
   
 -- Install dependencies by using command ```npm install && npm run start```

 -- browse the app via http://localhost:3000