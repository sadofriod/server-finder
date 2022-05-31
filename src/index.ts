import { getLocalIP } from './utils/getLocalIP';
import * as net from 'net';
import isPortTaken from './utils/isPortTaken';
import { initPort, isDev } from './utils/constant';

const getServerPort = async (port = initPort): Promise<number> => {

  if (isDev) {
    const isInvalidPort = await isPortTaken(port);

    if (!isInvalidPort) {
      return getServerPort(port + 1)
    } else {
      return port;
    }
  } else {
    return 4400

  }
}

const server: net.Server = net.createServer((socket) => {
  const ips = getLocalIP();
  console.log('client connected, ip:', ips?.address);
  socket.on('end', () => {
    console.log('client disconnected');
  });
  // console.log(remotePort, remoteAddress);

  socket.on('data', (data) => {
    console.log(data.toString());

  })

  socket.write(JSON.stringify({
    message: ips?.address,
    type: 'server'
  }))

  socket.pipe(socket);
});

getServerPort().then(serverPort => {
  console.log(serverPort);
  server.listen(serverPort, () => {
    console.log(server.address());
  });

  if (serverPort === initPort) {
    return;
  };
  const client = net.createConnection({ port: serverPort - 1 }, () => {
    console.log('connected to server')
  });

  client.on('data', (data) => {
    const formatData = JSON.parse(data.toString());
    if(formatData.type !== 'server'){
      return;
    };
    console.log(formatData) 
  });

  client.write(JSON.stringify({
    type: 'client',
    message: {
      content: 'join',
      port: serverPort
    }
  }))
})

