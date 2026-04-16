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

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const route = isLogin ? "/auth/login" : "/auth/register";

    try {
        const res = await fetch(BASE_URL + route, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        console.log("AUTH:", data);

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
    }
}