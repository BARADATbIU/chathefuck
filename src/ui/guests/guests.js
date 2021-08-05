import template from "./guests.pug";
import userTmp from "./user.pug";

export default class Guests {
  constructor(appElement) {
    this.appElement = appElement;
    this.template = template;
    this.userTmp = userTmp;
  }

  init(guests) {
    this.element = this.appElement.querySelector("[data-role=guests]");

    if (guests.length === 0) return;

    [...guests].map(
      (guest) => (guest.message = guest.comment?.message || "...")
    );

    this.element.innerHTML = this.template({ guests });
  }

  setLastMessage(name, message) {
    for (const iterator of this.element.children) {
      if (iterator.dataset.userKey === name) {
        iterator.querySelector("[data-role=user-last-message]").textContent =
          message;
        break;
      }
    }
  }

  setPhoto(name, photo) {
    for (const iterator of this.element.children) {
      if (iterator.dataset.userKey === name) {
        iterator.querySelector("[data-role=user-avatar] img").src = photo;
        break;
      }
    }
  }

  addUser({ name, photo, comment: { message = "..." } }) {
    this.element.insertAdjacentHTML(
      "beforeend",
      this.userTmp({ name, photo, message })
    );
  }

  removeUser(name) {
    for (const iterator of this.element.children) {
      if (iterator.dataset.userKey === name) {
        iterator.remove();
        break;
      }
    }
  }
}
