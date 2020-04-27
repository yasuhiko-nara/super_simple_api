// import { response } from "express";
const getDiv = document.querySelector("button.get");
const postDiv = document.querySelector("button.post");
const deleteDiv = document.querySelector("button.delete");
const patchDiv = document.querySelector("button.patch");

const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
ctx.font = "10px serif";

let canvasObjs = [];
function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Word {
  constructor(value) {
    this.value = value;
    this.x = random(50, 200);
    this.y = random(50, 200);
    this.color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
    this.size = 10;
  }
  draw() {
    ctx.fillText(this.value, this.x, this.y);
    ctx.fillStyle = this.color;
  }
}

deleteDiv.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log("delete");
  const inputName = document.querySelector("textarea.delete").value;
  const opt = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    // body: JSON.stringify(inputFavorites),
  };
  async function deleteFunc() {
    const response = await fetch(`/api/delete/${inputName}`, opt);
    return response;
  }
  deleteFunc()
    .then((res) => res.text())
    .then((text) => {
      console.log(text);
      const word = new Word(text);
      word.draw();
    });
});
getDiv.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasObjs = [];

  console.log("get");
  const inputName = document.querySelector("textarea.get").value;
  async function get() {
    const response = await fetch(`/api/get/${inputName}`);
    return response;
  }
  get()
    .then((res) => res.text())
    .then((text) => {
      console.log(text);
      if (text === "Not found") {
        const word = new Word(text);
        word.draw();
        return;
      }
      const favorites = JSON.parse(text);
      for (const favorite of favorites) {
        canvasObjs.push(new Word(favorite));
      }
      for (const obj of canvasObjs) {
        obj.draw();
      }
    });
});
postDiv.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasObjs = [];
  console.log("post");
  const inputName = document.querySelector("textarea.post.name").value;
  const inputFavorites = document.querySelector("textarea.post.like").value;
  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify([inputFavorites]),
  };
  async function post() {
    const response = await fetch(`/api/post/${inputName}`, opt);
    return response;
  }
  post()
    .then((res) => res.text())
    .then((text) => {
      const favorites = JSON.parse(text);
      for (const favorite of favorites) {
        canvasObjs.push(new Word(favorite));
      }
      for (const obj of canvasObjs) {
        obj.draw();
      }
    });
});

patchDiv.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log("patch");
  const inputName = document.querySelector("textarea.patch.name").value;
  const inputUnlike = document.querySelector("textarea.post.unlike").value;
  const opt = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify([inputUnlike]),
  };
  async function patch() {
    const response = await fetch(`/api/patch/${inputName}`, opt);
    return response;
  }
  patch()
    .then((res) => res.text())
    .then((text) => {
      console.log(text);
      const word = new Word(text);
      word.draw();
    });
});
