import "./styles/style.css";

import initLoginForm from "components/login";

initLoginForm();

export function renderView(view, locals = {}) {
  document.querySelector("#app").innerHTML = view(locals);
}
