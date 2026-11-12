const fs = require('fs');
const net = require('net');
const tls = require('tls');

class Socket {
  constructor(host, port, options = {}) {
    this.host = host;
    this.port = port;
    this.options = options;
  }

  send(query) {
    query = query.replace(/\\n/g, '\n');
    query = query.trimEnd() + '\n';

    const tlsEnabled = this.optionAsBool(this.options.tls, false);
    const connectTimeout = this.timeoutMilliseconds(
      this.options.connect_timeout,
      this.options.timeout
    );
    const readTimeout = this.timeoutMilliseconds(this.options.timeout, 30);

    return new Promise((resolve, reject) => {
      let response = '';
      let settled = false;
      let connected = false;

      const settleResolve = (value) => {
        if (!settled) {
          settled = true;
          resolve(value);
        }
      };

      const settleReject = (error) => {
        if (!settled) {
          settled = true;
          reject(error);
        }
      };

      const socket = tlsEnabled
        ? tls.connect(this.tlsOptions(connectTimeout))
        : net.createConnection({ host: this.host, port: this.port });

      socket.setTimeout(connectTimeout);

      const onConnected = () => {
        connected = true;
        socket.setTimeout(readTimeout);
        socket.write(query);
      };

      if (tlsEnabled) {
        socket.once('secureConnect', onConnected);
      } else {
        socket.once('connect', onConnected);
      }

      socket.on('data', (data) => {
        response += data.toString();
      });

      socket.on('end', () => {
        settleResolve(response);
      });

      socket.on('timeout', () => {
        socket.destroy();
        const phase = connected ? 'read' : 'connection';
        settleReject(new Error(`Socket ${phase} timeout`));
      });

      socket.on('error', (err) => {
        settleReject(err);
      });
    });
  }

  tlsOptions(connectTimeout) {
    const tlsVerify = this.optionAsBool(this.options.tls_verify, true);
    const servername = this.options.tls_server_name || this.host;
    const options = {
      host: this.host,
      port: this.port,
      servername,
      rejectUnauthorized: tlsVerify,
      timeout: connectTimeout,
    };

    if (this.options.tls_ca_file) {
      options.ca = fs.readFileSync(this.options.tls_ca_file);
    } else if (this.options.tls_ca) {
      options.ca = this.options.tls_ca;
    }

    return options;
  }

  optionAsBool(value, defaultValue) {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }

    return Boolean(value);
  }

  timeoutMilliseconds(value, fallbackSeconds) {
    const seconds = Number(value === undefined ? fallbackSeconds : value);
    return Number.isFinite(seconds) && seconds >= 0
      ? seconds * 1000
      : fallbackSeconds * 1000;
  }
}

module.exports = Socket;
