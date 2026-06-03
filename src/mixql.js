const QueryTypes = require('./types');
const Socket = require('./socket');

class MixQL extends QueryTypes {
  constructor(options = { timeout: 30 }, host = 'localhost', port = 7272) {
    super();
    this.options = options;
    this.host = host;
    this.port = port;
    this.socket = new Socket(host, port, options);
  }

  async execute() {
    this.res = await this.socket.send(this.query);
    return this;
  }
}

module.exports = MixQL;
