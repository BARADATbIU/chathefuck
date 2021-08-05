import "./modal.css";
import template from "./modal.pug";

export default class Modal {
  constructor(appElement, sendImage) {
    this.appElement = appElement;
    this.sendImage = sendImage;
    this.template = template;
  }

  init(userName) {
    this.appElement.insertAdjacentHTML("beforeend", this.template());

    this.element = this.appElement.querySelector("[data-role=avatar-modal]");

    const input = this.element.querySelector("[data-role=avatar-input]");
    const preview = this.element.querySelector("[data-role=avatar-preview]");
    const saveBtn = this.element.querySelector("[data-role=avatar-save]");
    const closeBtn = this.element.querySelector("[data-role=avatar-close]");

    const imageData = {
      file: "",
      name: "",
    };

    input.addEventListener("change", (e) => {
      const formats = ["image/png", "image/jpeg"];

      const reader = new FileReader();

      const file = e.target.files[0];

      if (file && formats.includes(file.type)) {
        reader.readAsDataURL(file);
      } else {
        preview.style.backgroundImage = "";

        imageData.file = "";
        imageData.name = "";

        saveBtn.classList.add("hidden");
      }

      reader.onloadend = () => {
        const base64Img = reader.result;

        preview.style.backgroundImage = `url(${base64Img})`;

        imageData.file = base64Img.replace(/^.+,/, "");
        imageData.name = file.name.replace(/^.+(?=\.)/, userName);

        saveBtn.classList.remove("hidden");
      };
    });

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!imageData.file) return;

      this.sendImage(imageData);

      this.hide();
    });

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      this.hide();
    });
  }

  show() {
    this.element.classList.add("open");
  }

  hide() {
    this.element.classList.remove("open");
  }
}
