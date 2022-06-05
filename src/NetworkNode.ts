import { nanoid } from "nanoid";
import { initPort } from "./utils/constant";
import * as net from 'net';
import { getLocalIP } from "./utils/getLocalIP";
// import getServerPort from "./utils/getServerPort";

export default class NetworkNode {
  id: string;
  port: number;
  parentNode: string | null = null;
  server: net.Server | null = null;
  client: net.Socket | null = null;

  //custom community event
  eventBus: { eventName: string; handle?: (data: Buffer) => any }[] = [];

  constructor(port?: number) {
    this.id = nanoid();
    this.port = port || initPort
    return this;
  };

  init(port?: number, callback?: any) {
    const server = net.createServer((socket) => {
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
    server.listen(port || this.port, callback)
    this.server = server;
    return this;
  }

  connect(ip?: string, port?: number, callback?: any) {
    const client = net.createConnection({
      host: ip,
      port: port || this.port
    }, callback);

    client.write(JSON.stringify({
      type: 'client',
      id: this.id,
      message: {
        content: this.id + ' join',
      }
    }));

    client.on('data', (data) => {
      const formatData = JSON.parse(data.toString());
      if (formatData.type !== 'server' || formatData.id === this.id) {
        return;
      };
      this.eventBus.forEach(({ eventName, handle }) => {
        const { eventName: eName } = formatData.message;
        if (eName !== eventName || !handle) {
          return;
        }
        handle(data)
      })
    })
    this.client = client;
    return this;
  }

  disconnect() {
    try {
      if (this.client === null) {
        throw new Error("current node is not initial");
      }
      this.client.end();
    } catch (error) {
      console.log(error);

    }

  }

  onDisconnect(handle: () => any) {
    try {
      if (this.server === null) {
        throw new Error("server is not initial")
      }
      this.server.on('close', handle);
    } catch (error) {
      console.log(error);
    }
  }

}