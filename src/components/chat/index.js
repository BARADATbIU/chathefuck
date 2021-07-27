import "./chat.css";
import { renderView } from "../../index";
import chatTemplate from "./chat.pug";
import listTemplate from "./users-list.pug";
import commentTemplate from "./comment.pug";

export default function initChat({ userName }) {
  renderView(chatTemplate);

  const container = document.querySelector("#chat-container");
  const usersList = container.querySelector(".chat__aside");
  const members = container.querySelector(".chat__members");
  const commentList = container.querySelector(".chat__comments");
  const modal = container.querySelector(".modal");

  const user = {
    name: userName,
    photo: "",
    comments: [],
  };

  const socket = socketInit();

  handleInputBtn();

  function socketInit() {
    const socket = new WebSocket("ws://localhost:8081");

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "open", user }));
    });

    socket.addEventListener("message", (e) => {
      const { type, users, activeUser } = JSON.parse(e.data);

      switch (type) {
        case "open":
        case "close":
          renderCustomMessage(type, activeUser.name);
          updateUserNumbers(users.length);
          break;

        case "message":
          renderComments(activeUser);

          commentList.scrollTop = commentList.clientHeight;
          break;

        case "avatar":
          break;

        default:
          break;
      }

      renderUsers(users);
    });

    return socket;
  }

  function handleInputBtn() {
    const input = container.querySelector(".chat__input");
    const sendBtn = container.querySelector(".chat__button");

    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const message = input.value;

      if (message === "") return;

      sendMessage(message);

      input.value = "";
    });
  }

  function handleAvatarBtn() {
    const avatarBtn = usersList.querySelector(".current-user .user-avatar");
    const modalCloseBtn = modal.querySelector(".modal__close-btn");
    const modalSaveBtn = modal.querySelector(".modal__save-btn");
    const modalInput = modal.querySelector(".modal__input");
    const preview = modal.querySelector(".modal__preview");

    const imageData = {
      file: "",
      name: "",
    };

    avatarBtn.addEventListener("click", (e) => {
      e.preventDefault();

      modal.classList.add("open");

      modalInput.addEventListener("change", (e) => {
        const formats = ["image/png", "image/jpeg"];

        const reader = new FileReader();

        const file = e.target.files[0];

        reader.onloadend = () => {
          const base64Img = reader.result;

          preview.style.backgroundImage = `url(${base64Img})`;

          imageData.file = base64Img.replace(/^.+,/, "");
          imageData.name = file.name.replace(/^.+(?=\.)/, user.name);

          toogleSaveBtn("remove");
        };

        if (file && formats.includes(file.type)) {
          reader.readAsDataURL(file);
        } else {
          preview.style.backgroundImage = "";

          imageData.file = "";
          imageData.name = "";

          toogleSaveBtn("add");
        }
      });

      modalSaveBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!imageData.file) return;

        socket.send(JSON.stringify({ type: "avatar", imageData }));

        modal.classList.remove("open");
      });

      function toogleSaveBtn(option) {
        modalSaveBtn.classList[option]("hidden");
      }

      modalCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();

        modal.classList.remove("open");
      });
    });
  }

  function sendMessage(message) {
    const currentTime = getCurrentTimeString();

    const comment = { message, date: currentTime };

    socket.send(JSON.stringify({ type: "message", comment }));
  }

  function getCurrentTimeString() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes}`;
  }

  function renderUsers(users) {
    const setLastUserMessage = (user) => {
      const lastUserComment =
        user.comments[user.comments.length - 1]?.message || "...";

      user.message = lastUserComment;

      return user;
    };

    const updatedUsers = [...users].map((user) =>
      setLastUserMessage({ ...user })
    );

    const currentUser = updatedUsers.find(({ name }) => name === userName);
    const guestUsers = updatedUsers.filter(({ name }) => name !== userName);

    usersList.innerHTML = listTemplate({ currentUser, guestUsers });

    handleAvatarBtn();
  }

  function renderComments(activeUser) {
    const isCurrentUser = activeUser.name === userName;

    const element = document.createElement("div");

    element.innerHTML = commentTemplate({
      user: activeUser,
      reverse: isCurrentUser,
    });

    if (activeUser.comments.length > 1) {
      commentList.replaceChild(element, commentList.lastChild);
    }

    commentList.appendChild(element);
  }

  function renderCustomMessage(type, name) {
    const element = document.createElement("p");
    element.classList.add("message__status");

    const statusText = type === "open" ? "зашел в чат" : "покинул чат";
    element.textContent = `${name} ${statusText}`;

    commentList.appendChild(element);
  }

  function updateUserNumbers(number) {
    members.innerText = `Online: ${number}`;
  }
}
