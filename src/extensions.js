const {
  MIXQL_LIMIT, MIXQL_LENGTH, MIXQL_SHA, MIXQL_UPPERCASE,
  MIXQL_STOREAS, MIXQL_STORED_QUERIES, MIXQL_ASHASH,
  MIXQL_KEY, MIXQL_SALT, MIXQL_PEPPER,
} = require('./constants');

class Extensions {
  constructor() {
    this.query = '';
    this.res = '';
  }

  amount(limit) {
    this.query = this.query + MIXQL_LIMIT + limit;
    return this;
  }

  length(length) {
    this.query = this.query + MIXQL_LENGTH + length;
    return this;
  }

  sha() {
    this.query = this.query + MIXQL_SHA;
    return this;
  }

  uppercase() {
    let uppercaseQuery = this.query + ' ' + MIXQL_UPPERCASE;
    if (this.query.includes('\\n')) {
      const lines = this.query.split('\\n');
      const query = lines[0] || this.query;
      const params = lines.slice(1).join('\\n');
      uppercaseQuery = query + MIXQL_UPPERCASE + '\\n' + params;
    }
    this.query = uppercaseQuery;
    return this;
  }

  key(key) {
    this.query = this.query.replace(MIXQL_ASHASH, MIXQL_KEY + key + MIXQL_ASHASH);
    return this;
  }

  salt(...salts) {
    this.query = this.query.replace(MIXQL_ASHASH, MIXQL_SALT + salts.join(',') + MIXQL_ASHASH);
    return this;
  }

  pepper(...peppers) {
    this.query = this.query.replace(MIXQL_ASHASH, MIXQL_PEPPER + peppers.join(',') + MIXQL_ASHASH);
    return this;
  }

  store(name) {
    this.query = this.query + MIXQL_STOREAS + name;
    return this;
  }

  bind(params) {
    for (const param of params) {
      this.query += '\n' + param;
    }
    return this;
  }

  rawQuery() {
    return this.query;
  }

  json() {
    this.res = JSON.stringify(this.array());
    return this;
  }

  pretty() {
    this.res = JSON.stringify(JSON.parse(this.res), null, 2);
    return this;
  }

  array() {
    if (this.res.includes(MIXQL_STORED_QUERIES)) {
      return this.parseRawList(this.res);
    }
    const normalized = this.res.replace(/\r\n|\r/g, '\n');
    return normalized.split('\n').map(l => l.trim()).filter(Boolean);
  }

  parseRawList(response) {
    const lines = response.split('\n');
    const data = [];
    for (const line of lines) {
      const match = line.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/);
      if (match) {
        const name = match[1].trim();
        const query = match[2].trim();
        if (name.toLowerCase() === 'name' && query.toLowerCase() === 'query') continue;
        data.push({ name, query });
      }
    }
    return data;
  }

  toString() {
    return this.res;
  }
}

module.exports = Extensions;
