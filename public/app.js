// public/app.js

async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  document.getElementById("todoList").innerHTML = todos
    .map(
      t => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${t.text}
        <span class="badge bg-secondary">${t.status}</span>
      </li>`
    )
    .join("");
}

async function addTodo() {
  const text = document.getElementById("newTodo").value;
  if (!text) return;
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  document.getElementById("newTodo").value = "";
  loadTodos();
}

loadTodos();
