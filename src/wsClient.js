export default class WSClient {
  constructor(url, onMessage) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect() {
    return new Promise((resolve) => {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener("open", resolve);

      this.socket.addEventListener("message", (e) => {
        const { type, data } = JSON.parse(e.data);

        this.onMessage(type, data);
      });
    });
  }

  sendOpen(name) {
    this.send("open", { user: { name, photo: "", comment: {}, comments: [] } });
  }

  sendMessage(comment) {
    this.send("message", { comment });
  }

  sendPhoto(imageData) {
    this.send("photo", { imageData });
  }

  send(type, data) {
    this.socket.send(JSON.stringify({ type, data }));
  }

  close() {
    this.socket.close(3000);
  }
}
