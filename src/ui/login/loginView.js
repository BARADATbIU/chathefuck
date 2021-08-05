import "./login.css";
import template from "./login.pug";

export default class LoginView {
  constructor(appElement, onlogin) {
    this.template = template;
    this.appElement = appElement;
    this.onlogin = onlogin;
  }

  init() {
    this.appElement.innerHTML = this.template();

    const input = this.appElement.querySelector("[data-role=login-input]");
    const button = this.appElement.querySelector("[data-role=login-submit]");

    button.addEventListener("click", (e) => {
      e.preventDefault();

      const userName = input.value;

      if (userName.length < 3) {
        this.setError("Ник должен быть более 3 символов");
        return;
      }

      this.onlogin({ userName });
    });
  }

  setError(error = "") {
    this.appElement.querySelector("[data-role=login-error]").textContent =
      error;
  }

  destroy() {
    this.appElement.innerHTML = "";
  }
}
