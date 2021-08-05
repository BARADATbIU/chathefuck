import "./user.css";
import template from "./user.pug";

export default class User {
  constructor(appElement, showModal) {
    this.appElement = appElement;
    this.showModal = showModal;
    this.template = template;
  }

  init(name) {
    this.name = name;

    this.element = this.appElement.querySelector("[data-role=current-user]");
    this.element.innerHTML = this.template({ name, photo: "", message: "..." });

    this.nameElement = this.element.querySelector("[data-role=user-name]");
    this.photoElement = this.element.querySelector(
      "[data-role=user-avatar] img"
    );
    this.lastMessageElement = this.element.querySelector(
      "[data-role=user-last-message]"
    );

    const activatorElement = this.element.querySelector(
      "[data-role=user-avatar]"
    );

    activatorElement.addEventListener("click", (e) => {
      e.preventDefault();

      this.showModal();
    });
  }

  setName(name) {
    this.name = name;
    this.nameElement.textContent = name;
  }

  getName() {
    return this.name;
  }

  setPhoto(url) {
    this.photoElement.parentNode.classList.remove("plus-sign");
    this.photoElement.src = url;
  }

  setLastMessage(message) {
    this.lastMessageElement.textContent = message;
  }
}
