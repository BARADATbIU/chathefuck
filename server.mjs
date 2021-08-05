import fs from "fs";
import WebSocket from "ws";

const { Server, OPEN } = WebSocket;

const wss = new Server({ port: 8081 });

const users = new Map();

wss.on("connection", (ws) => {
  users.set(ws, {});

  const activeUser = users.get(ws);

  ws.on("message", (body) => {
    const { type, data } = JSON.parse(body);
    const { user = {}, comment = {}, imageData = {} } = data;

    switch (type) {
      case "open":
        if ([...users.values()].some((u) => u.name === user.name)) {
          ws.send(JSON.stringify({ type: "deny", data: { activeUser: user } }));
          return;
        }

        users.set(ws, Object.assign(activeUser, user));

        break;

      case "message":
        activeUser.comment = comment;

        break;

      case "photo":
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

  ws.on("close", (e) => {
    users.delete(ws);

    if (e === 3000) return;

    sendToClients("close");
  });

  function sendToClients(type) {
    wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(
          JSON.stringify({
            type,
            data: {
              users: [...users.values()],
              activeUser,
              isCurrent: client === ws,
            },
          })
        );
      }
    });
  }
});
