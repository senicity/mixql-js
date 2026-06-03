const Extensions = require('./extensions');
const {
  MIXQL_SELECT, MIXQL_ASHASH, MIXQL_CREATE_SALT, MIXQL_CREATE_KEY,
  MIXQL_CREATE_UUID, MIXQL_STORE_LIST, MIXQL_STORE_DELETE,
  MIXQL_STORE_SELECT, MIXQL_STORE_USE, MIXQL_AUTH,
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

  auth(username, password) {
    this.query = MIXQL_AUTH + username + ':' + password + '\n' + this.query;
    return this;
  }
}

module.exports = QueryTypes;
