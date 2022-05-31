import { networkInterfaces } from 'os';

export const getLocalIP = (networkInterfaceName = 'br0', type: 'IPv4' | 'IPv6' = 'IPv4') => {
  const ipTable = networkInterfaces();
  
  const network = ipTable[networkInterfaceName];
  if (!network) {
    throw new Error('not have this network')
  }
  const result = network.find(({ family }) => {
    return family === type
  });

  if (!result) {
    throw new Error(`not supports ${type}`,)
  }
  return result

}