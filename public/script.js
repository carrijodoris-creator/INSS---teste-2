let token = localStorage.getItem("token");

async function login() {
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("token", data.token);

        if (data.tipo === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "app.html";
        }
    } else {
        alert("Login inválido");
    }
}

async function consultar() {
    const res = await fetch('/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });

    const data = await res.json();

    document.getElementById("resultado").innerHTML = `
        <p>Status: ${data.beneficio?.status || "N/A"}</p>
        <p>Valor: ${data.beneficio?.valor || "N/A"}</p>
        <p>Pagamento: ${data.beneficio?.pagamento || "N/A"}</p>
    `;
}

function baixarApp() {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
        window.location.href = "https://play.google.com/store/apps/details?id=br.gov.inss.mobile";
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        window.location.href = "https://apps.apple.com/br/app/meu-inss/id1446095916";
    } else {
        alert("Acesse pelo celular para baixar o app");
    }
}

async function carregarUsuarios() {
    const res = await fetch('/admin/users');
    const users = await res.json();

    let html = "";

    users.forEach(u => {
        html += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
            <b>${u.nome}</b><br>
            CPF: ${u.cpf}<br>
            Email: ${u.email || "-"}<br>
            <button onclick="editar('${u.cpf}')">Editar</button>
            <button onclick="deletar('${u.cpf}')">Excluir</button>
        </div>`;
    });

    document.getElementById("lista").innerHTML = html;
}

async function criarUsuario() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;

    await fetch('/admin/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, senha, email })
    });

    alert("Criado");
    carregarUsuarios();
}

async function editar(cpf) {
    const nome = prompt("Nome:");
    const email = prompt("Email:");
    const senha = prompt("Nova senha:");

    await fetch('/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, nome, email, senha })
    });

    carregarUsuarios();
}

async function deletar(cpf) {
    if (!confirm("Excluir?")) return;

    await fetch('/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf })
    });

    carregarUsuarios();
}

// Mostrar WhatsApp após delay
setTimeout(() => {
    const btn = document.querySelector(".whatsapp");
    if (btn) btn.style.display = "block";
}, 4000);

if (window.location.pathname.includes("admin.html")) {
    carregarUsuarios();
}