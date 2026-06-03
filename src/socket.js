const net = require('net');

class Socket {
  constructor(host, port, options) {
    this.host = host;
    this.port = port;
    this.options = options;
  }

  send(query) {
    query = query.replace(/\\n/g, '\n');
    query = query.trimEnd() + '\n';

    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      let response = '';

      socket.setTimeout(this.options.timeout * 1000);

      socket.connect(this.port, this.host, () => {
        socket.write(query);
      });

      socket.on('data', (data) => {
        response += data.toString();
      });

      socket.on('end', () => {
        resolve(response);
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('Socket timeout'));
      });

      socket.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = Socket;
