import { initPort, isDev } from "./constant";
import isPortTaken from "./isPortTaken";

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

export default getServerPort;