async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, action: "login" })
  });
  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user_id", data.user.id);
    window.location.href = "/index.html";
  } else {
    alert(data.error);
  }
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, action: "register" })
  });
  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user_id", data.user.id);
    localStorage.setItem("username", data.user.username); // <--- guardar username
    window.location.href = "/index.html";
  }
  else {
    alert(data.error);
  }
}

