
# Blug Forum - Backend API

Detta är ett projekt för att bygga ett forum-API med fokus på säkerhet.

## Kom igång

Följ dessa steg för att köra projektet lokalt:

### 1. Klona repository
```bash
git clone <https://github.com/OmarDatamanager/blug-forum>
cd blug-forum
````

### 2. Installera dependencies

```bash
npm install
```

### 3. Skapa och konfigurera `.env`-fil

Kopiera `.env.example` till `.env` och fyll i dina egna inställningar:

```bash
cp .env.example .env
```

**Exempel på innehåll i `.env`:**

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blug_forum
DB_USER=postgres
DB_PASSWORD=ditt_lösenord
JWT_SECRET=din_hemliga_jwt_nyckel
PORT=3000
```

### 4. Starta servern

För utveckling (med nodemon):

```bash
npm run dev
```

För produktion:

```bash
npm start
```

## Projektstruktur

```
blug-forum/
│
├─ src/
│  ├─ controllers/    # Hanterar affärslogik
│  ├─ models/         # Databasmodeller
│  ├─ routes/         # API-rutter
│  ├─ middleware/     # Middleware för autentisering och säkerhet
│  ├─ config/         # Konfigurationsfiler
│  ├─ app.js          # Express-app
│  └─ server.js       # Startpunkt för servern
│
├─ .env               # Miljövariabler
├─ .env.example       # Exempel på miljövariabler
├─ package.json       # Projektets metadata och scripts
└─ README.md          # Denna fil
```

## Tekniska beroenden

* [Express](https://expressjs.com/) - Webbramverk
* [PostgreSQL](https://www.postgresql.org/) - Databas
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Lösenordshantering
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JWT-autentisering
* [cors](https://www.npmjs.com/package/cors) - Hantering av cross-origin requests
* [helmet](https://www.npmjs.com/package/helmet) - Säkerhetsheaders
* [nodemon](https://www.npmjs.com/package/nodemon) - För utveckling

---

##  Databas & Server

### 1. Skapa databasen
Anslut till PostgreSQL och skapa en ny databas:


```sql
CREATE DATABASE blug_forum;
```

De centrala tabellerna är definierade för användare, forum, trådar, meddelanden och behörigheter (moderatorer och medlemmar i privata trådar).

 Databasanslutningen hanteras via `src/config/database.js` med hjälp av `pg` och miljövariabler i `.env`.

### 2. Server & applikation

* **Express** är konfigurerad i `src/app.js` med `helmet`, `cors` och `express.json()` för säkerhet och JSON-hantering.
* **Servern** startas från `src/server.js` och läser in miljövariablerna från `.env`.

### 3. Hälsokontroll

En test-endpoint finns för att verifiera att servern körs korrekt:

* **Route:** `GET /api/health`
* **Respons-exempel:**

```json
{
  "status": "OK",
  "message": "Blug Forum API is running",
  "timestamp": "2025-09-30T09:39:52.480Z"
}
```

Testad i **Postman** och fungerar som förväntat 

---

##  Kom igång

### Installation

```bash
npm install
```

### Starta i utvecklingsläge

```bash
npm run dev
```

---

##  Autentisering (Register & Login)

Ett enkelt autentiseringssystem har implementerats.

###  Struktur
- `src/models/userModel.js` – hanterar databasfrågor för användare (skapa, hitta via e-post, hitta via ID).
- `src/controllers/authController.js` – logik för registrering och inloggning (bcrypt-hashning + JWT).
- `src/routes/authRoutes.js` – definierar API-endpoints för autentisering.
- `src/app.js` – kopplar in auth-routes under `/api/auth`.

###  Funktionalitet
- **Registrering (`POST /api/auth/register`)**
  - Skapar ny användare med hashat lösenord
  - Returnerar användardata (utan lösenord)
- **Inloggning (`POST /api/auth/login`)**
  - Verifierar e-post och lösenord
  - Returnerar JWT-token + användarinfo


Exempelrespons (login):

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "member"
  }
}
```

###  Databas

* Lösenord lagras hashade med **bcryptjs**
* Token genereras med **jsonwebtoken**
* Data sparas i tabellen `users`

```sql
SELECT * FROM users;
```

###  Exempel på `users`-tabell

| id | username | email           | password                       | role   | created_at           |
|----|----------|-----------------|--------------------------------|--------|----------------------|
| 1  | testuser | test@example.com| $2b$10$xbNJ80h4iCAURmIbESWe0O...| member | 2025-09-30 17:20:43 

---

## Autentisering Middleware & Skyddade Användarrutter

### Middleware (`src/middleware/auth.js`)

* **verifyToken**: Validerar JWT från `Authorization: Bearer <token>` headern. Returnerar `401` om ingen token skickas eller `400` om token är ogiltig.
* **requireAdmin**: Säkerställer att användaren har rollen `admin`, annars returneras `403`.

### Användarrutter (`src/routes/userRoutes.js`)

Skyddade rutter som kräver giltig JWT.

* **GET** `/api/users`
  Hämtar alla användare (utan lösenord).

  **Exempelrequest (Postman):**

  ```
  GET http://localhost:3000/api/users
  Headers:
  Authorization: Bearer <JWT_token>
  ```

  **Exempelrespons:**

  ```json
  [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "member",
      "created_at": "2025-09-30T15:20:43.319Z"
    }
  ]
  ```

* **GET** `/api/users/:id`
  Hämtar en specifik användare baserat på ID. Returnerar `404` om ingen användare hittas.

### App-integration (`src/app.js`)

```javascript
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
```
---