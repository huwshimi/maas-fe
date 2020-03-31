import { nanoid } from "nanoid";
import ReconnectingWebSocket from "reconnecting-websocket";

class WebSocketClient {
  constructor(websocket_url) {
    this.socket = new ReconnectingWebSocket(websocket_url);
    this._nextId = 0;
    this._requests = new Map();
  }

  /**
   * Store a mapping of id to action type.
   * @param {String} action - A base Redux action type.
   * @returns {Integer} The id that was created.
   */
  _addRequest(action, requestID) {
    const id = requestID || nanoid();
    this._requests.set(id, action);
    return id;
  }

  /**
   * Get a base action type from a given id.
   * @param {Integer} id - A request id.
   * @returns {String} A base Redux action type.
   */
  getRequest(id) {
    return this._requests.get(id);
  }

  /**
   * Send a websocket message.
   * @param {String} action - A base Redux action type.
   * @param {Object} message - The message content.
   */
  send(action, message, requestID) {
    const id = this._addRequest(action, requestID);
    const payload = {
      ...message,
      request_id: id
    };
    this.socket.send(JSON.stringify(payload));
  }
}

export default WebSocketClient;
