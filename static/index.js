const UPDATE = 1000;
const SEND_PAGE = "push";
const RECEIVE_PAGE = "pull";
const METHOD = "POST";
const HEADERS = {
    "Content-Type": "application/json"
};
const SUCCESS = "success";

const table = document.getElementById("table");
const tableBase = table.innerHTML;

async function push() {
    let response = await window.fetch(
        SEND_PAGE,
        {
            method: METHOD,
            headers: HEADERS,
            body: JSON.stringify({
                name: document.getElementById("name").value,
                message: document.getElementById("message").value
            })
        }
    );
    
    let json = await response.json();
    
    if (json.status === SUCCESS) {
        document.getElementById("message").value = "";
    }
    
    else {
        window.alert("Failed to send message...");
    }
}

function checkKey(e) {
    if (e.key === "Enter") {
        push();
    }
}

function clearTable() {
    table.innerHTML = tableBase;
}

let timestamp = "";

async function pull() {
    let response = await window.fetch(
        RECEIVE_PAGE,
        {
            method: METHOD,
            headers: HEADERS,
            body: JSON.stringify({
                timestamp: timestamp
            })
        }
    );
    
    let json = await response.json();
    let messages = json.messages;
    
    if (messages.length) {
        timestamp = messages[0][0];
        clearTable();
        
        messages.forEach(message => {
            let row = document.createElement("tr");
            let t = document.createElement("td");
            let n = document.createElement("td");
            let m = document.createElement("td");
            
            t.innerHTML = message[0];
            n.innerHTML = message[1];
            m.innerHTML = message[2];
            
            row.appendChild(t);
            row.appendChild(n);
            row.appendChild(m);
            table.appendChild(row);
        });
    }
}

window.setInterval(pull, UPDATE);