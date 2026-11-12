const QueryTypes = require('./types');
const Socket = require('./socket');

class MixQL extends QueryTypes {
  constructor(options = {}, host = 'localhost', port = 7272) {
    super();
    this.options = {
      timeout: 30,
      connect_timeout: 10,
      tls: false,
      tls_verify: true,
      ...options,
    };
    this.host = host;
    this.port = port;
    this.socket = new Socket(host, port, this.options);
  }

  async execute() {
    this.res = await this.socket.send(this.query);
    return this;
  }
}

module.exports = MixQL;
