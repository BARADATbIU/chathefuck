import "./main.css";
import template from "./main.pug";
import { sanitize } from "../../utils";

export default class MainView {
  constructor(appElement, onSend) {
    this.appElement = appElement;
    this.onSend = onSend;
    this.template = template;
  }

  init() {
    this.appElement.innerHTML = this.template();

    const submit = this.appElement.querySelector("[data-role=comment-submit]");

    this.input = this.appElement.querySelector("[data-role=comment-input]");
    this.membersElement = this.appElement.querySelector("[data-role=members]");

    submit.addEventListener("click", (e) => {
      e.preventDefault();

      if (this.input.value === "") return;

      const comment = {
        message: this.input.value,
        date: this.getCurrentTimeString(),
      };

      this.onSend(comment);
    });
  }

  clear() {
    this.input.value = "";
  }

  getCurrentTimeString() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);

    return `${hours}:${minutes}`;
  }

  updateUserNumbers(number) {
    this.membersElement.textContent = number;
  }

  destroy() {
    this.appElement.innerHTML = "";
  }
}
