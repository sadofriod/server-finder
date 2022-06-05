import NetworkNode from "./NetworkNode";

export default class NetworkNodeEvent extends NetworkNode {

  constructor() {
    super();
  }

  emit<T = any>(eventName: string, data: T) {
    const content = (msg: any) => ({
      type: 'client',
      id: this.id,
      message: { eventName, data: msg }
    })
    try {
      if (this.client === null) {
        throw new Error("current node is not initial");
      }
      if (typeof data === 'object') {
        this.client.write(JSON.stringify(content(data)))
      }
      else if (typeof data === 'function') {
        return this.client.write(JSON.stringify(content(data.toString())))
      } else {
        this.client.write(JSON.stringify(content(data)))
      }

    } catch (error) {
      console.log(error)
    }
  }

  on(eventName: string, handle: any) {
    this.eventBus.push({ eventName, handle })
  }

  unsubscribe(eventName: string) {
    this.eventBus.map(({ eventName: eName, handle }) => eName === eventName ? null : { eventName: eName, handle })
      .filter(item => !item)
  }
}