
# Blug Forum - Backend API

Detta är ett projekt för att bygga ett forum-API med fokus på säkerhet.

## Kom igång

Följ dessa steg för att köra projektet lokalt:

### 1. Klona repository
```bash
git clone <repo-url>
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



