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
    const li = document.createElement("div");
    li.className = "todo-card";

    // Texto del ToDo
    const spanText = document.createElement("span");
    spanText.textContent = t.text;
    li.appendChild(spanText);

    // Div de botones (dropdown y eliminar)
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "d-flex align-items-center gap-1";

    // Dropdown compacto para cambiar estado
    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown";

    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-primary dropdown-toggle p-0";
    btn.style.width = "30px";
    btn.style.height = "30px";
    btn.setAttribute("type", "button");
    btn.setAttribute("data-bs-toggle", "dropdown");
    btn.textContent = "▼"; // Flecha
    dropdownDiv.appendChild(btn);

    const menu = document.createElement("ul");
    menu.className = "dropdown-menu";

    ["pendiente", "en_progreso", "terminada"].forEach(statusOption => {
      if (statusOption === t.status) return; // no mostrar estado actual

      const item = document.createElement("li");
      const a = document.createElement("a");
      a.className = "dropdown-item";
      a.href = "#";

      // Mostrar texto amigable
      let displayText = "";
      switch(statusOption) {
        case "pendiente": displayText = "Pendiente"; break;
        case "en_progreso": displayText = "En progreso"; break;
        case "terminada": displayText = "Completados"; break;
      }

      a.textContent = displayText;
      a.onclick = (e) => {
        e.preventDefault();
        changeStatus(t.id, statusOption); // mantener valor interno para la DB
      };

      item.appendChild(a);
      menu.appendChild(item);
    });

    dropdownDiv.appendChild(menu);
    actionsDiv.appendChild(dropdownDiv);

    // Botón eliminar
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "🗑";
    delBtn.onclick = () => deleteTodo(t.id);
    actionsDiv.appendChild(delBtn);

    li.appendChild(actionsDiv);

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
    body: JSON.stringify({ text, user_id: Number(userId) })
  });

  if (!res.ok) {
    const data = await res.json();
    return alert(data.error || "Error agregando todo");
  }

  document.getElementById("newTodo").value = "";
  loadTodos();
}

function logout() {
  localStorage.removeItem("user_id"); // elimina el id del usuario
  window.location.href = "/login.html"; // redirige al login
}

async function changeStatus(id, newStatus) {
  const res = await fetch("/api/todos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status: newStatus })
  });

  if (!res.ok) {
    const data = await res.json();
    return alert(data.error || "Error cambiando estado");
  }

  loadTodos();
}

async function deleteTodo(id) {
  const confirmDelete = confirm("¿Seguro que quieres eliminar este ToDo?");
  if (!confirmDelete) return;

  const res = await fetch("/api/todos", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  if (!res.ok) {
    const data = await res.json();
    return alert(data.error || "Error eliminando ToDo");
  }

  loadTodos(); // recargar lista después de eliminar
}



loadTodos();
