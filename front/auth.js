let isLogin = true;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("authForm").onsubmit = auth;

    document.getElementById("toggleAuth").onclick = () => {
        isLogin = !isLogin;

        document.getElementById("authTitle").innerText =
            isLogin ? "Login" : "Registrar";

        document.getElementById("toggleAuth").innerText =
            isLogin ? "Registrar" : "Login";
    };
});

// =======================
// AUTH REQUEST
// =======================
async function auth(e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    // 🔥 garante string SEMPRE
    password = String(password);

    console.log("FRONT DEBUG:", { username, password, type: typeof password });

    if (!username || !password) {
        alert("Preencha username e password");
        return;
    }

    const route = isLogin ? "/auth/login" : "/auth/register";

    try {
        const res = await fetch(BASE_URL + route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        console.log("AUTH RESPONSE:", data);

        if (!res.ok) {
            alert(data.message || "Erro na requisição");
            return;
        }

        if (isLogin && data.token) {
            localStorage.setItem("token", data.token);
            location.reload();
        }

        if (!isLogin) {
            alert("Registrado! agora faça login.");
            isLogin = true;
        }

    } catch (err) {
        console.error("AUTH ERROR:", err);
        alert("Erro de conexão com servidor");
    }
}