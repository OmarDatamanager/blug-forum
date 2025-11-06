
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

## Forum-API

Ett nytt forum-system har implementerats som gör det möjligt att skapa, hämta och visa forum. Systemet använder autentisering (JWT) för skyddade endpoints.

### Funktionalitet

* **Skapa forum (skyddad)**
  Endast inloggade användare kan skapa nya forum.
* **Hämta alla forum (öppen)**
  Hämtar en lista över alla tillgängliga forum.
* **Hämta forum via ID (öppen)**
  Returnerar detaljer om ett specifikt forum.

### Endpoints

#### Skapa forum

**POST** `/api/forums`

* **Headers:**
  `Authorization: Bearer <JWT_TOKEN>`
* **Body:**

```json
{
  "name": "Programming",
  "description": "Discussion about programming languages"
}
```

* **Exempel på svar:**

```json
{
  "message": "Forum created successfully",
  "forum": {
    "id": 1,
    "name": "Programming",
    "description": "Discussion about programming languages",
    "slug": "programming",
    "created_by": 1,
    "created_at": "2025-10-01T20:44:02.400Z"
  }
}
```

#### Hämta alla forum

**GET** `/api/forums`

* **Exempel på svar:**

```json
[
  {
    "id": 1,
    "name": "Programming",
    "description": "Discussion about programming languages",
    "slug": "programming",
    "created_by": 1,
    "created_at": "2025-10-01T20:44:02.400Z",
    "creator_name": "testuser"
  }
]
```

#### Hämta forum via ID

**GET** `/api/forums/by-id/:id`

* **Exempel:**
  `GET http://localhost:3000/api/forums/by-id/1`

* **Exempel på svar:**

```json
[
  {
    "id": 1,
    "name": "Programming",
    "description": "Discussion about programming languages",
    "slug": "programming",
    "created_by": 1,
    "created_at": "2025-10-01T20:44:02.400Z"
  }
]
```
---

#  Threads API

Beskrivning av den nya **Threads-funktionaliteten** som utökar forumsystemet.
En tråd (Thread) är ett diskussionsämne inom ett forum och kan vara publik eller privat.
Endast autentiserade användare kan skapa trådar eller ändra ägarskap, medan läsning är öppen för alla.


##  Autentisering

* **Publika endpoints** kräver ingen autentisering.
* **Skyddade endpoints** kräver en giltig **JWT-token** i headern:

```
Authorization: Bearer <TOKEN>
```


##  Endpoints

### 1. Skapa en ny tråd *(skyddad)*

**POST** `/api/threads/:forum`
Skapar en ny tråd i ett specifikt forum.

**URL-parametrar**:

* `:forum` → Forumets ID.

**Request Body**:

```json
{
  "title": "Help with Node.js",
  "is_public": true
}
```

**Svar**:

```json
{
  "message": "Thread created successfully",
  "thread": {
    "id": 1,
    "title": "Help with Node.js",
    "forum_id": 1,
    "created_by": 1,
    "is_public": true,
    "created_at": "2025-10-02T15:55:29.994Z"
  }
}
```


### 2. Hämta alla trådar i ett forum *(publik)*

**GET** `/api/threads/:forum`
Returnerar en lista med alla trådar för ett specifikt forum.

**URL-parametrar**:

* `:forum` → Forumets ID.

**Svar**:

```json
[
  {
    "id": 1,
    "title": "Help with Node.js",
    "forum_id": 1,
    "created_by": 1,
    "is_public": true,
    "created_at": "2025-10-02T15:55:29.994Z",
    "creator_name": "testuser"
  }
]
```


### 3. Hämta en specifik tråd *(publik)*

**GET** `/api/threads/:forum/:thread`
Hämtar detaljer om en enskild tråd.

**URL-parametrar**:

* `:forum` → Forumets ID.
* `:thread` → Trådens ID.

**Svarsexempel**:

```json
{
  "id": 1,
  "title": "Help with Node.js",
  "forum_id": 1,
  "created_by": 1,
  "is_public": true,
  "created_at": "2025-10-02T15:55:29.994Z",
  "creator_name": "testuser"
}
```


### 4. Uppdatera trådägare *(skyddad)*

**PATCH** `/api/threads/:forum/:thread`
Överför ägarskapet av en tråd till en annan användare. Endast den nuvarande ägaren kan göra detta.

**URL-parametrar**:

* `:forum` → Forumets ID.
* `:thread` → Trådens ID.

**Request Body**:

```json
{
  "changeCreator": 2
}
```

**Svar**:

```json
{
  "message": "Thread ownership transferred successfully",
  "thread": {
    "id": 1,
    "title": "Help with Node.js",
    "forum_id": 1,
    "created_by": 2,
    "is_public": true,
    "created_at": "2025-10-02T15:55:29.994Z"
  }
}
```


### Åtkomstkontroll vid ägarbyte

Endast den nuvarande trådägaren får ändra ägarskapet.  
Om en annan användare försöker genomföra begäran returneras ett **403 Forbidden**-fel.

**Exempel:**

Begäran:
```http
PATCH http://localhost:3000/api/threads/1/1
Headers: Authorization: Bearer TOKEN_FÖR_ANNAN_ANVÄNDARE
Body:
{
  "changeCreator": 2
}
````

Svar:

```json
{
  "error": "Only thread owner can transfer ownership"
}
```

##  Sammanfattning

* **POST /api/threads/:forum** → Skapa ny tråd *(kräver token)*
* **GET /api/threads/:forum** → Lista trådar i forum *(öppen)*
* **GET /api/threads/:forum/:thread** → Hämta en tråd *(öppen)*
* **PATCH /api/threads/:forum/:thread** → Ändra trådägare *(kräver token)*

---

#  Meddelandesystem (Messages)

Denna modul lägger till stöd för **meddelanden i trådar**. Användare kan skapa, läsa, uppdatera och ta bort sina egna meddelanden i en tråd. Endast ägaren av ett meddelande kan ändra eller ta bort det.

## Endpoints

###  Skapa nytt meddelande

**POST** `/api/:forum/:thread`
Kräver **Bearer-token**

**Body-exempel:**

```json
{
  "text": "This is a test message in the thread"
}
```

**Svar:**

```json
{
  "message": {
    "id": 1,
    "content": "This is a test message in the thread",
    "thread_id": 1,
    "user_id": 1,
    "created_at": "2025-10-04T17:29:07.835Z"
  }
}
```


###  Lista alla meddelanden i en tråd

**GET** `/api/:forum/:thread/messages`

**Svar:**

```json
[
  {
    "id": 1,
    "content": "This is a test message in the thread",
    "thread_id": 1,
    "user_id": 1,
    "created_at": "2025-10-04T17:29:07.835Z",
    "username": "testuser"
  }
]
```


###  Hämta ett enskilt meddelande

**GET** `/api/:forum/:thread/:id`

**Svar:**

```json
{
  "id": 1,
  "content": "This is a test message in the thread",
  "thread_id": 1,
  "user_id": 1,
  "created_at": "2025-10-04T17:29:07.835Z"
}
```


###  Uppdatera ett meddelande

**PATCH** `/api/:forum/:thread/:id`
Kräver **Bearer-token** och att användaren äger meddelandet.

**Body-exempel:**

```json
{
  "text": "This is an edited message"
}
```

**Svar:**

```json
{
  "message": "Message updated successfully",
  "message": {
    "id": 1,
    "content": "This is an edited message",
    "thread_id": 1,
    "user_id": 1,
    "created_at": "2025-10-04T17:29:07.835Z"
  }
}
```


###  Ta bort ett meddelande

**DELETE** `/api/:forum/:thread/:id`
Kräver **Bearer-token** och att användaren äger meddelandet.

**Svar:**

```json
{
  "message": "Message deleted successfully"
}
```


 Med detta system kan användare nu interagera direkt i trådar genom att skriva meddelanden, redigera dem eller ta bort dem vid behov. Systemet säkerställer att endast **ägaren av ett meddelande** har rättigheter att ändra eller ta bort det.

---

#  Moderator- och medlems­hantering för trådar

Detta tillägg gör det möjligt att hantera **moderatorer** och **medlemmar** för privata trådar.
Trådägaren kan utse moderatorer, och både ägare och moderatorer kan bjuda in eller ta bort medlemmar från en tråd.


##  Förutsättningar

* Du måste vara **inloggad** och använda en giltig **JWT Bearer Token** i alla anrop.
* Endast **trådägaren** kan:

  * Lägga till / ta bort moderatorer.
* **Trådägaren och moderatorer** kan:

  * Bjuda in / ta bort medlemmar från en tråd.


##  API-ändpunkter (Moderators)

### 1. Lägg till moderator

```http
POST http://localhost:3000/api/threads/:thread/moderators
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "user_id": 2
}
```

 **Svar:**

```json
{
  "message": "Moderator added successfully"
}
```


### 2. Ta bort moderator

```http
DELETE http://localhost:3000/api/threads/:thread/moderators
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "user_id": 2
}
```

 **Svar:**

```json
{
  "message": "Moderator removed successfully"
}
```


##  API-ändpunkter (Medlemmar i privata trådar)

### 3. Bjud in användare till tråd

```http
POST http://localhost:3000/api/threads/:thread/invite
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "user_id": 3
}
```

 **Svar:**

```json
{
  "message": "User invited to thread successfully"
}
```


### 4. Ta bort användare från tråd

```http
DELETE http://localhost:3000/api/threads/:thread/members
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "user_id": 3
}
```

 **Svar:**

```json
{
  "message": "User removed from thread successfully"
}
```


##  Exempel (steg för steg i Postman)

1. **Registrera en ny användare**

   ```http
   POST http://localhost:3000/api/auth/register
   Body:
   {
     "username": "user2",
     "email": "user2@example.com",
     "password": "password123"
   }
   ```

   **Svar:**

   ```json
   {
     "message": "User created successfully",
     "user": {
       "id": 2,
       "username": "user2",
       "email": "user2@example.com",
       "role": "member",
       "created_at": "2025-10-06T09:09:45.971Z"
     }
   }
   ```

2. **Logga in** → hämta `token`.

3. **Lägg till användaren som moderator i en tråd** med endpointen ovan.

4. **Bjud in ytterligare medlemmar** eller **ta bort dem** efter behov.


##  Sammanfattning

* **Ägare** kontrollerar moderatorer.
* **Ägare + moderatorer** kontrollerar trådens medlemmar.
* Säkerhet tillämpas med JWT-token i varje begäran.
* Systemet ger en tydlig rollfördelning mellan **ägare → moderatorer → medlemmar**.

---

# Blug Forum - Säkerhetsdokumentation

##  Implementerade Säkerhetsfunktioner

### Autentisering och Auktorisering
- **JWT-baserad autentisering** - Säker token-baserad inloggning
- **Bcrypt lösenordskryptering** - Lösenord hashas med saltning
- **Rollbaserad åtkomstkontroll** - Användare, moderators, administratörer

**Exempel på JWT implementation:**
```javascript
// Login controller
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### Rate Limiting Skydd
```javascript
// Inloggning: max 5 försök per 15 minuter
// Allmänna requests: max 100 requests per 15 minuter
```
- **Skydd mot:** Brute force-attacker och DoS

**Exempel på rate limiting:**
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts' }
});
```

### Input Validation
- **Användarregistrering** - Validering av e-post och lösenord
- **Trådskapande** - Titelvalidering och längdkontroll

**Exempel på validering:**
```javascript
const validateUserRegistration = (req, res, next) => {
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  next();
};
```

### Åtkomstkontrollsystem

#### Hierarki av Rättigheter
1. **Oinloggade användare** - Läsa publika trådar
2. **Registrerade användare** - Skapa inlägg och trådar
3. **Trådägare** - Hantera trådinställningar och moderators
4. **Moderators** - Moderera innehåll i tråd
5. **Administratörer** - Full systemaccess

**Exempel på åtkomstkontroll:**
```javascript
// Middleware för trådägare
if (threadInfo.created_by !== req.user.userId) {
  return res.status(403).json({ error: 'Access denied. Thread owner only.' });
}
```

### Dataskydd
- **Lösenord:** Lagras hashad med bcrypt
- **Känslig data:** Skyddad via environment variables
- **Användarrättigheter:** Möjlighet att radera eget konto

**Exempel på lösenordskryptering:**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
const validPassword = await bcrypt.compare(password, user.password);
```

### SQL Injection Skydd
- **Prepared statements** via pg biblioteket
- **Parameteriserade queries** i alla databasanrop

**Exempel på säkra databasanrop:**
```javascript
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [email]);
```

### Säkerhetsheaders med Helmet.js
```javascript
app.use(helmet());
// Automatisk konfiguration av säkerhetsheaders
```

### Felhantering
- **Generiska felmeddelanden** - Undviker information läckage
- **Strukturerade felresponser** - Konsekvent API-respons

**Exempel på säker felhantering:**
```javascript
try {
  // Kod här
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Server error' });
}
```

##  Testa Säkerhetsfunktioner

### Rate Limiting Test
```bash
# Testa med flera inloggningsförsök
POST /api/auth/login (6 gånger på 15 minuter)
```

### Åtkomstkontroll Test
```bash
# Testa att komma åt skyddade routes utan token
GET /api/users (utan Authorization header)
```

### Validering Test
```bash
# Testa ogiltig registrering
POST /api/auth/register
{
  "username": "a",
  "email": "invalid-email",
  "password": "123"
}
```

---


##  Startsida Gränssnitt

Applikationen har nu en enkel startsida tillgänglig på `http://localhost:3000/` som fungerar som:

###  Funktioner:
- **Realtid serverstatus** övervakning
- **Komplett API endpoints** dokumentation
- **Klickbara tester** för vanliga endpoints
- **En enkel responsivt design**
- **Postman integrationsguide**

###  Teknisk Information:
- **Inbäddad HTML/CSS** inom Express.js
- **Mobil-responsive** design
- **Inga externa beroenden**
- **Omedelbar API-dokumentation**

###  Användning:
Besök `http://localhost:3000/` efter att ha startat servern med `npm run dev` för att:
- Verifiera serverstatus 
- Se alla några endpoints 
- Testa API-funktionalitet 
- Få Postman installationsinstruktioner 

###  Filläge:
- **Implementation:** `src/app.js`
- **Route:** `app.get('/', (req, res) => { ... })`
- **Typ:** Inbäddad HTML med inline CSS

###  Snabbstart:
```bash
npm run dev
```
Öppna sedan webbläsaren och gå till: `http://localhost:3000/`

###  API Endpoints Visas:
- `/api/health` - Server hälsokontroll
- `/api/auth/login` - Användarinloggning
- `/api/forums` - Forums hantering
- `/api/threads` - Trådar hantering
- `/api/messages` - Meddelanden hantering
```

---


**Postman Collection**: [docs/postman/blug-forum-collection.json](docs/postman/blug-forum-collection.json)
Importera denna fil till Postman för att testa alla API-endpoints



