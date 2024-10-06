// broker/broker.js

const aedes = require('aedes')();
const net = require('net');

const port = 1883;
const server = net.createServer(aedes.handle);

server.listen(port, function () {
  console.log(`MQTT Broker rodando na porta ${port}`);
});

aedes.on('client', function (client) {
  console.log(`Novo cliente conectado: ${client.id}`);
});

aedes.on('clientDisconnect', function (client) {
  console.log(`Cliente desconectado: ${client.id}`);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log(
      `Mensagem publicada pelo cliente ${client.id}: ${packet.payload.toString()}`,
    );
  }
});
