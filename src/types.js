const Extensions = require('./extensions');
const {
  MIXQL_SELECT, MIXQL_ASHASH, MIXQL_CREATE_SALT, MIXQL_CREATE_KEY,
  MIXQL_CREATE_UUID, MIXQL_STORE_LIST, MIXQL_STORE_DELETE,
  MIXQL_STORE_SELECT, MIXQL_STORE_USE, MIXQL_AUTH,
  MIXQL_SHA256, MIXQL_SHA512, MIXQL_ENC_GCM, MIXQL_DEC_GCM,
  MIXQL_HMAC, MIXQL_ARGON2, MIXQL_ARGON2_VERIFY,
} = require('./constants');

class QueryTypes extends Extensions {
  raw(query) {
    this.query = query;
    return this;
  }

  select(hash) {
    this.query = MIXQL_SELECT + hash + MIXQL_ASHASH;
    return this;
  }

  createSalt() {
    this.query = MIXQL_CREATE_SALT;
    return this;
  }

  createKey() {
    this.query = MIXQL_CREATE_KEY;
    return this;
  }

  createUUID() {
    this.query = MIXQL_CREATE_UUID;
    return this;
  }

  storeList() {
    this.query = MIXQL_STORE_LIST;
    return this;
  }

  storeDelete(name) {
    this.query = MIXQL_STORE_DELETE + name;
    return this;
  }

  storeSelect(name) {
    this.query = MIXQL_STORE_SELECT + name;
    return this;
  }

  storeUse(name) {
    this.query = MIXQL_STORE_USE + name;
    return this;
  }

  sha256(expr = ':input') {
    this.query = MIXQL_SELECT + MIXQL_SHA256 + expr + ')' + MIXQL_ASHASH;
    return this;
  }

  sha512(expr = ':input') {
    this.query = MIXQL_SELECT + MIXQL_SHA512 + expr + ')' + MIXQL_ASHASH;
    return this;
  }

  encGcm(expr = ':input') {
    this.query = MIXQL_SELECT + MIXQL_ENC_GCM + expr + ')' + MIXQL_ASHASH;
    return this;
  }

  decGcm(expr = ':input') {
    this.query = MIXQL_SELECT + MIXQL_DEC_GCM + expr + ')' + MIXQL_ASHASH;
    return this;
  }

  hmac(keyExpr = ':key', msgExpr = ':msg') {
    this.query = MIXQL_SELECT + MIXQL_HMAC + keyExpr + ', ' + msgExpr + ')' + MIXQL_ASHASH;
    return this;
  }

  argon2(expr = ':input') {
    this.query = MIXQL_SELECT + MIXQL_ARGON2 + expr + ')' + MIXQL_ASHASH;
    return this;
  }

  argon2Verify(hashExpr = ':hash', passExpr = ':password') {
    this.query = MIXQL_SELECT + MIXQL_ARGON2_VERIFY + hashExpr + ', ' + passExpr + ')' + MIXQL_ASHASH;
    return this;
  }

  auth(username, password) {
    this.query = MIXQL_AUTH + username + ':' + password + '\n' + this.query;
    return this;
  }
}

module.exports = QueryTypes;
