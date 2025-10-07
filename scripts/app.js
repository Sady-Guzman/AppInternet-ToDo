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

    // Texto
    const spanText = document.createElement("span");
    spanText.textContent = t.text;
    li.appendChild(spanText);

    // Badge
    const spanStatus = document.createElement("span");
    spanStatus.className = "badge mx-2";

    switch (t.status) {
      case "pendiente":
        spanStatus.classList.add("bg-danger"); // rojo
        break;
      case "en_progreso":
        spanStatus.classList.add("bg-warning", "text-dark"); // amarillo con texto oscuro
        break;
      case "terminada":
        spanStatus.classList.add("bg-success"); // verde
        break;
      default:
        spanStatus.classList.add("bg-secondary"); // gris por defecto
    }

    spanStatus.textContent = t.status;
    li.appendChild(spanStatus);

    // Dropdown para cambiar estado
    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown";

    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-primary dropdown-toggle";
    btn.setAttribute("type", "button");
    btn.setAttribute("data-bs-toggle", "dropdown");
    btn.textContent = "Cambiar estado";

    const menu = document.createElement("ul");
    menu.className = "dropdown-menu";

    ["pendiente", "en_progreso", "terminada"].forEach(statusOption => {
      if (statusOption === t.status) return;
      const item = document.createElement("li");
      const a = document.createElement("a");
      a.className = "dropdown-item";
      a.href = "#";
      a.textContent = statusOption;
      a.onclick = (e) => {
        e.preventDefault();
        changeStatus(t.id, statusOption);
      };
      item.appendChild(a);
      menu.appendChild(item);
    });

    dropdownDiv.appendChild(btn);
    dropdownDiv.appendChild(menu);
    li.appendChild(dropdownDiv);

    // Agregar a la columna correcta
    if (t.status === "pendiente") document.getElementById("pendientes").appendChild(li);
    if (t.status === "en_progreso") document.getElementById("enProgreso").appendChild(li);
    if (t.status === "terminada") document.getElementById("completados").appendChild(li);

    // Botón eliminar
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger ms-2";
    delBtn.textContent = "Eliminar";
    delBtn.onclick = () => deleteTodo(t.id);
    li.appendChild(delBtn);

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
