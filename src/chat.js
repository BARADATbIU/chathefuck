import LoginView from "./ui/login/loginView";
import MainView from "./ui/main/mainView";
import User from "./ui/user/user";
import Modal from "./ui/modal/modal";
import Comments from "./ui/comments/comments";
import Guests from "./ui/guests/guests";

import WSClient from "./wsClient";

export default class Chat {
  constructor() {
    this.appElement = document.querySelector("#app");

    this.wsClient = new WSClient(
      "ws://localhost:8081",
      this.onMessage.bind(this)
    );

    this.ui = {
      loginView: new LoginView(this.appElement, this.onLogin.bind(this)),
      mainView: new MainView(this.appElement, this.onSend.bind(this)),
      modal: new Modal(this.appElement, this.sendImage.bind(this)),
      user: new User(this.appElement, this.showModal.bind(this)),
      comments: new Comments(this.appElement),
      guests: new Guests(this.appElement),
    };

    this.ui.loginView.init();
  }

  async onLogin({ userName }) {
    await this.wsClient.connect();

    this.wsClient.sendOpen(userName);
  }

  onSend(comment) {
    this.wsClient.sendMessage(comment);

    this.ui.mainView.clear();
  }

  onMessage(type, data) {
    const { users = [], activeUser = {}, isCurrent } = data;

    const usersChange = () => {
      if (!isCurrent) {
        this.ui.comments.addCustomMessage(type, activeUser.name);
        this.ui.comments.scrollToBottom();
      }

      this.ui.mainView.updateUserNumbers(users.length);
    };

    switch (type) {
      case "open":
        if (isCurrent) {
          this.ui.loginView.destroy();

          this.ui.mainView.init();
          this.ui.user.init(activeUser.name);
          this.ui.modal.init(activeUser.name);
          this.ui.comments.init();
          this.ui.guests.init(
            users.filter(({ name }) => name !== this.ui.user.getName())
          );
        } else {
          this.ui.guests.addUser(activeUser);
        }

        usersChange();

        break;

      case "close":
        this.ui.guests.removeUser(activeUser.name);

        usersChange();
        break;

      case "message":
        isCurrent
          ? this.ui.user.setLastMessage(activeUser.comment.message)
          : this.ui.guests.setLastMessage(
              activeUser.name,
              activeUser.comment.message
            );

        this.ui.comments.checkLastComment(activeUser.name)
          ? this.ui.comments.addMessage(activeUser.comment)
          : this.ui.comments.addComment(activeUser, isCurrent);

        this.ui.comments.scrollToBottom();

        break;

      case "photo":
        isCurrent
          ? this.ui.user.setPhoto(activeUser.photo)
          : this.ui.guests.setPhoto(activeUser.name, activeUser.photo);

        this.ui.comments.setPhoto(activeUser.name, activeUser.photo);

        break;

      case "deny":
        this.wsClient.close();

        this.ui.loginView.setError(
          `Пользователь с ником "${activeUser.name}" уже существует`
        );
        break;

      default:
        break;
    }
  }

  showModal() {
    this.ui.modal.show();
  }

  sendImage(imageData) {
    this.wsClient.sendPhoto(imageData);
  }
}
