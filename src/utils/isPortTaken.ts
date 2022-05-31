import { createServer } from "net";

const isPortTaken =  (port: number, type: 'IPv4' | 'IPv6' = 'IPv4') => {
  let hasError = 0;
  return new Promise((res) => {
    const server = createServer()
      .once('error', err => { if (err) { res(false) } })
      .once('listening', () => {
        server
          .once('close', () => {
            hasError++;
            if (hasError > 1) {
              res(false)
            } else {
              res(true)
            }
          })
          .close()
      })
      .listen(port, type === 'IPv4' ? '0.0.0.0' : '::')
  })

};

export default isPortTaken