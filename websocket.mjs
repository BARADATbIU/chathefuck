import fs from "fs";
import WebSocket from "ws";

const { Server, OPEN } = WebSocket;

const wss = new Server({ port: 8081 });

const users = new Map();

wss.on("connection", (ws) => {
  users.set(ws, {});

  const activeUser = users.get(ws);

  ws.on("message", (body) => {
    const { type, user = {}, comment = "", imageData = {} } = JSON.parse(body);

    switch (type) {
      case "open":
        users.set(ws, Object.assign(activeUser, user));
        updateLastActiveUser();

        break;

      case "message":
        activeUser.isLastActive
          ? activeUser.comments.push(comment)
          : (activeUser.comments = [comment]);
        updateLastActiveUser();

        break;

      case "avatar":
        fs.existsSync("dist/uploads") || fs.mkdirSync("dist/uploads");

        fs.writeFile(
          `dist/uploads/${imageData.name}`,
          imageData.file,
          "base64",
          (e) => console.log(e)
        );

        activeUser.photo = `uploads/${imageData.name}`;

        break;

      default:
        break;
    }

    sendToClients(type);
  });

  ws.on("close", () => {
    users.delete(ws);

    sendToClients("close");
    updateLastActiveUser();
  });

  function sendToClients(type) {
    wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(
          JSON.stringify({
            type,
            users: [...users.values()],
            activeUser,
          })
        );
      }
    });
  }

  function updateLastActiveUser() {
    users.forEach((user) => (user.isLastActive = user === activeUser));
  }
});
