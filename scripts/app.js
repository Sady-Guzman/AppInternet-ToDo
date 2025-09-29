async function loadTodos() {
  const userId = localStorage.getItem("user_id"); 
  if (!userId) return;

  const res = await fetch(`/api/todos?user_id=${userId}`);
  const todos = await res.json();

  // Limpiar listas
  document.getElementById("pendientes").innerHTML = "";
  document.getElementById("enProgreso").innerHTML = "";
  document.getElementById("completados").innerHTML = "";

  todos.forEach(t => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = t.text;

    // Badge con status
    const span = document.createElement("span");
    span.className = "badge bg-secondary";
    span.textContent = t.status;
    li.appendChild(span);

    // Agregar a la columna correcta
    if (t.status === "pendiente") document.getElementById("pendientes").appendChild(li);
    if (t.status === "en_progreso") document.getElementById("enProgreso").appendChild(li);
    if (t.status === "terminada") document.getElementById("completados").appendChild(li);
  });
}

async function addTodo() {
  const text = document.getElementById("newTodo").value.trim();
  if (!text) return alert("Escribe algo");

  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Usuario no logueado");

  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, user_id: userId })
  });

  if (!res.ok) {
    const data = await res.json();
    return alert(data.error || "Error agregando todo");
  }

  document.getElementById("newTodo").value = "";
  loadTodos();
}


loadTodos();




