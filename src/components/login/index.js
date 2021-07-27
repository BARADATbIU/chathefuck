import "./login.css";
import { renderView } from "../../index";
import initChat from "components/chat";

export default async function initLoginForm() {
  // initChat({ userName: "Fuckface" });

  const { default: login } = await import("./login.pug");

  renderView(login);

  const form = document.querySelector(".login__form");
  const input = form.querySelector(".login__input");
  const button = form.querySelector(".login__button");

  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const userName = input.value;

    if (userName.length < 3) return;

    initChat({ userName });
  });
}
