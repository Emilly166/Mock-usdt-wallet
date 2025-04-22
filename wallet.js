
let wallets = {
  "user1": { balance: 1000, history: [] },
  "user2": { balance: 500, history: [] }
};

let currentUser = "";

function login() {
  const id = document.getElementById("login-id").value;
  if (!wallets[id]) {
    wallets[id] = { balance: 0, history: [] };
  }
  currentUser = id;
  document.getElementById("current-user").innerText = id;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  updateBalance();
  renderQR();
  renderHistory();
}

function updateBalance() {
  document.getElementById("balance").innerText = wallets[currentUser].balance;
}

function sendUSDT() {
  const receiver = document.getElementById("receiver").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!wallets[receiver]) {
    wallets[receiver] = { balance: 0, history: [] };
  }

  if (wallets[currentUser].balance < amount) {
    alert("Insufficient funds.");
    return;
  }

  wallets[currentUser].balance -= amount;
  wallets[receiver].balance += amount;

  const tx = {
    to: receiver,
    from: currentUser,
    amount: amount,
    time: new Date().toLocaleString()
  };

  wallets[currentUser].history.unshift({ ...tx, type: "sent" });
  wallets[receiver].history.unshift({ ...tx, type: "received" });

  updateBalance();
  renderHistory();
  document.getElementById("receiver").value = "";
  document.getElementById("amount").value = "";
}

function renderQR() {
  const canvas = document.getElementById("qrCanvas");
  const qr = new QRious({
    element: canvas,
    value: currentUser,
    size: 150
  });
}

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  wallets[currentUser].history.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type === 'sent' ? 'Sent' : 'Received'} ${tx.amount} USDT ${tx.type === 'sent' ? 'to' : 'from'} ${tx.type === 'sent' ? tx.to : tx.from} on ${tx.time}`;
    list.appendChild(li);
  });
}
