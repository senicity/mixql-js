```
███╗   ███╗██╗██╗  ██╗ ██████╗ ██╗     
████╗ ████║██║╚██╗██╔╝██╔═══██╗██║     
██╔████╔██║██║ ╚███╔╝ ██║   ██║██║     
██║╚██╔╝██║██║ ██╔██╗ ██║▄▄ ██║██║     
██║ ╚═╝ ██║██║██╔╝ ██╗╚██████╔╝███████╗
╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚══▀▀═╝ ╚══════╝   
__  __
\ \/ /
 \  / 
 /  \ 
/_/\_\
     _     
    (_)___ 
    | / __|
    | \__ \
    | |___/
   _/ |    
  |__/     
                                       
// -- Powered by:

┏┓┏┓┳┓┳┏┓┳┏┳┓┓┏
┗┓┣ ┃┃┃┃ ┃ ┃ ┗┫
┗┛┗┛┛┗┻┗┛┻ ┻ ┗┛
               
// --> https://senicity.com
// --
```

# MixQL for Node.js

A fluent Node.js client library for the MixQL encryption server. This package provides an object-oriented interface for performing hashing, salting, encryption, and key generation operations through the MixQL query language.

## Installation

```bash
npm install @senicity/mixql
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@senicity/mixql": "^1.0.0"
  }
}
```

## Quick Start

```js
const MixQL = require('@senicity/mixql');

const mixql = new MixQL();

const result = await mixql.select('SHA1(:input)')
  .bind(['hello'])
  .execute();

console.log(result.toString());
```

## Configuration

```js
// Custom connection settings
const mixql = new MixQL(
  { timeout: 30 },        // Socket timeout in seconds
  'mixql.example.com',    // Server host
  8080                    // Server port
);
```

### Default Values
- **Host**: `'localhost'`
- **Port**: `7272`
- **Timeout**: `30` seconds

## Authentication

```js
const result = await mixql.select('SHA1(:password)')
  .bind(['mysecret123'])
  .auth('admin', 'secret123')
  .execute();
```

## Query Examples

### SELECT Queries (Hashing)

```js
// Basic SHA1 hash
const result = await mixql.select('SHA1(:input)')
  .bind(['password123'])
  .execute();

// MD5 hash with uppercase output
const result = await mixql.select('MD5(:data)')
  .bind(['sensitive_data'])
  .uppercase()
  .execute();

// Multiple parameters
const result = await mixql.select('SHA1(CONCAT(:a, :b))')
  .bind(['foo', 'bar'])
  .execute();
```

### SHA-256 & SHA-512 Hashing

```js
// SHA-256 hash (recommended over SHA1)
const result = await mixql.sha256()
  .bind(['password123'])
  .execute();

// SHA-512 hash
const result = await mixql.sha512()
  .bind(['password123'])
  .execute();

// With nested expression
const result = await mixql.sha256('CONCAT(:a, :b)')
  .bind(['foo', 'bar'])
  .execute();

// Uppercase output
const result = await mixql.sha256()
  .bind(['hello'])
  .uppercase()
  .execute();
```

### HMAC-SHA256

```js
// HMAC keyed hash (returns 64-char hex)
const result = await mixql.hmac()
  .bind(['mySecretKey', 'message to sign'])
  .execute();

// With custom expressions
const result = await mixql.hmac(':secret', ':data')
  .bind(['key123', 'payload'])
  .execute();
```

### Argon2 Password Hashing

```js
// Hash a password with Argon2id
const hash = await mixql.argon2()
  .bind(['mypassword123'])
  .execute();

// Verify a password against a stored hash
const result = await mixql.argon2Verify()
  .bind([storedHash, 'mypassword123'])
  .execute();

// Chain with SHA256 pre-hashing
const hash = await mixql.argon2('SHA256(:input)')
  .bind(['mypassword123'])
  .execute();

// Verify chained hash
const result = await mixql.argon2Verify(':hash', 'SHA256(:password)')
  .bind([storedHash, 'mypassword123'])
  .execute();
```

### Encryption / Decryption

```js
// Encrypt with custom key
const encrypted = await mixql.select('ENC(:input)')
  .bind(['my secret data'])
  .key('mysecretkey123')
  .execute();

// Decrypt with custom key
const decrypted = await mixql.select('DEC(:input)')
  .bind([encrypted.toString()])
  .key('mysecretkey123')
  .execute();

// With SALT layers
const encrypted = await mixql.select('ENC(:input)')
  .salt('saltkey1', 'saltkey2')
  .bind(['my secret data'])
  .execute();

// With PEPPER
const encrypted = await mixql.select('ENC(:input)')
  .pepper('abc', 'xyz')
  .bind(['my secret data'])
  .execute();

// Full: KEY + SALT + PEPPER
const encrypted = await mixql.select('ENC(:input)')
  .key('mykey')
  .salt('salt1', 'salt2')
  .pepper('pep1', 'pep2')
  .bind(['my secret data'])
  .execute();
```

### AES-256-GCM Encryption (Recommended)

```js
// GCM authenticated encryption
const encrypted = await mixql.encGcm()
  .bind(['my secret data'])
  .execute();

// GCM decryption
const decrypted = await mixql.decGcm()
  .bind([encrypted.toString()])
  .execute();

// GCM with custom key
const encrypted = await mixql.encGcm()
  .bind(['my secret data'])
  .key('mysecretkey123')
  .execute();

// GCM with KEY + SALT + PEPPER
const encrypted = await mixql.encGcm()
  .key('mykey')
  .salt('salt1', 'salt2')
  .pepper('pep1', 'pep2')
  .bind(['my secret data'])
  .execute();

// GCM decrypt with same options
const decrypted = await mixql.decGcm()
  .key('mykey')
  .salt('salt1', 'salt2')
  .pepper('pep1', 'pep2')
  .bind([encrypted.toString()])
  .execute();
```

### CREATE SALT

```js
// Multiple salts with custom length
const result = await mixql.createSalt()
  .amount(5)
  .length(32)
  .sha()
  .execute();
```

### CREATE KEY

```js
const result = await mixql.createKey()
  .amount(5)
  .execute();
```

### CREATE UUID

```js
const result = await mixql.createUUID().execute();
```

### STORE Commands

```js
// Store a query
await mixql.select('SHA1(:password)')
  .store('hash_password')
  .execute();

// List stored queries
const list = await mixql.storeList().execute();

// Use a stored query
const result = await mixql.storeUse('hash_password')
  .bind(['mysecret123'])
  .execute();

// Delete stored query
await mixql.storeDelete('hash_password').execute();
```

### Raw Queries

```js
const result = await mixql.raw('SELECT MD5(:data) AS hash UPPERCASE')
  .bind(['test_data'])
  .execute();
```

## Response Formatting

```js
// Get as array
const arr = result.array();

// Get as JSON string
result.json();
console.log(result.toString());

// Pretty-print JSON
result.json().pretty();
console.log(result.toString());

// Get raw query string (before execute)
const query = mixql.select('SHA1(:input)').bind(['test']).rawQuery();
```

## Available Methods

### Query Types
- `raw(query)` - Execute raw MixQL query
- `select(expression)` - SELECT query with hash expression
- `sha256(expr = ':input')` - SHA-256 hash
- `sha512(expr = ':input')` - SHA-512 hash
- `encGcm(expr = ':input')` - AES-256-GCM authenticated encrypt
- `decGcm(expr = ':input')` - AES-256-GCM authenticated decrypt
- `hmac(keyExpr = ':key', msgExpr = ':msg')` - HMAC-SHA256 keyed hash
- `argon2(expr = ':input')` - Argon2id password hash
- `argon2Verify(hashExpr = ':hash', passExpr = ':password')` - Verify Argon2 hash
- `createSalt()` - Generate random salt
- `createKey()` - Generate encryption key
- `createUUID()` - Generate UUID
- `storeList()` - List stored queries
- `storeSelect(name)` - View stored query
- `storeUse(name)` - Execute stored query
- `storeDelete(name)` - Delete stored query
- `auth(username, password)` - Add authentication

### Query Modifiers
- `amount(limit)` - Set result count limit
- `length(length)` - Set output length
- `sha()` - Apply SHA-1 hashing (for CREATE SALT)
- `uppercase()` - Convert output to uppercase
- `store(name)` - Store query with name
- `key(key)` - Set custom encryption key for ENC/DEC
- `salt(...salts)` - Add SALT layers for ENC/DEC
- `pepper(...peppers)` - Add PEPPER interleaving for ENC/DEC
- `bind(params)` - Bind parameters to placeholders

### Response Formatters
- `json()` - Convert response to JSON string
- `pretty()` - Pretty-print JSON response
- `array()` - Convert response to array
- `rawQuery()` - Get current query string
- `toString()` - Get raw response string

## Requirements

- Node.js 14+
- MixQL server running (default: localhost:7272)

## License

Copyright ©2026, Senicity Ltd. See `NOTICE` for details.
