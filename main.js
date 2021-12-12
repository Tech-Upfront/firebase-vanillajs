import "./style.css";

import { setDoc } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";
import app from "./config";

// Add a new document with a generated id.

let input = document.querySelector("input");
let form = document.querySelector("form");
let list = document.querySelector(".list");
let id;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const docRef = await addDoc(collection(getFirestore(app), "tasks"), {
    todo: input.value,
    done: false,
  });
  id = docRef.id;
});

const q = query(collection(getFirestore(app), "tasks"));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const activeDocuments = [];
  let completedTodos = [];
  list.innerHTML = ``;
  console.log(querySnapshot.docs.length);
  let activecount = document.getElementById("active-count");
  let completed = document.getElementById("completed");

  querySnapshot.forEach((doc, index) => {
    console.log(doc.data());

    const li = document.createElement("li");
    li.classList.add("collection-item");
    // li.innerText =
    li.id = doc.id;
    if (doc.data().done == true) {
      li.classList.add("done");
      completedTodos.push(doc.data());

      completed.innerText = ` Compeleted Todos Are : ${completedTodos.length}`;
      li.dataset.done = "true";
    } else {
      activeDocuments.push(doc.data());
      activecount.innerText = ` Active Todos Are : ${activeDocuments.length}`;
      li.classList.remove("done");
      li.dataset.done = "false";
    }
    li.classList.add("todo-items");
    li.innerHTML = `
    <div>${
      doc.data().todo
    }<a href="#!" class="secondary-content"><i class="material-icons">delete</i></a></div>
    `;
    list.appendChild(li);
    const trashcans = document.querySelectorAll(".secondary-content i");
    trashcans.forEach((trashcan) => {
      trashcan.addEventListener("click", deleteTodo);
    });

    li.addEventListener("click", EditTodo);
  });
});

async function EditTodo(e) {
  e.stopPropagation();

  let liDone;
  let id = e.target.parentElement.id;
  console.log(e.target);
  if (e.target.parentElement.dataset.done == "true") {
    liDone = false;
  } else {
    liDone = true;
    // console.log(e.target.dataset.done);
  }
  await setDoc(
    doc(getFirestore(app), "tasks", id),
    {
      done: liDone,
    },
    { merge: true }
  );
  console.log(e.target);

  // Add a new document in collection "cities"
}
async function deleteTodo(e) {
  e.stopPropagation();
  let id = e.target.parentElement.parentElement.parentElement.id;
  await deleteDoc(doc(getFirestore(app), "tasks", id));
}
