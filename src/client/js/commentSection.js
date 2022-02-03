import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let deleteBtns = document.querySelectorAll(".video__delete-btn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.className = "video__delete-btn";
  span2.innerText = " ❌";
  span2.addEventListener("click", handleDeleteClick);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDeleteClick = async (event) => {
  const li = event.target.parentNode;
  const { id } = li.dataset;
  const response = await fetch(`/api/comments/${id}/delete`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    li.remove();
  }
};

for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", handleDeleteClick);
}
