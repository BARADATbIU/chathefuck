import "./comments.css";
import template from "./comments.pug";
import messageTmp from "./message.pug";

export default class Comments {
  constructor(appElement) {
    this.appElement = appElement;
    this.template = template;
    this.messageTmp = messageTmp;
  }

  init() {
    this.element = this.appElement.querySelector("[data-role=comments]");
  }

  checkLastComment(key) {
    const lastElement = this.element.lastElementChild;

    return lastElement?.dataset?.userKey === key;
  }

  addComment(user, reverse) {
    this.element.insertAdjacentHTML(
      "beforeend",
      this.template({ user, reverse })
    );
  }

  addMessage({ message, date }) {
    const lastCommentMessages = this.element.lastElementChild.querySelector(
      "[data-role=messages]"
    );

    lastCommentMessages.insertAdjacentHTML(
      "beforeend",
      this.messageTmp({ message, date })
    );
  }

  addCustomMessage(type, name) {
    const element = document.createElement("p");
    element.classList.add("message__status");

    const statusText = type === "open" ? "зашел в чат" : "покинул чат";
    element.textContent = `${name} ${statusText}`;

    this.element.appendChild(element);
  }

  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }

  setPhoto(name, photo) {
    for (const iterator of this.element.children) {
      if (iterator?.dataset?.userKey === name) {
        iterator.querySelector("[data-role=user-avatar] img").src = photo;
      }
    }
  }
}
