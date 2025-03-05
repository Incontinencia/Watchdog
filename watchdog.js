const { spawn } = require("child_process");

const SERVER_NAME = "backend"; // PM2 process name

function startServer() {
    console.log("Starting server...");
    return spawn("pm2", ["start", SERVER_NAME], { stdio: "inherit" });
}

function stopServer() {
    console.log("Stopping server...");
    return spawn("pm2", ["stop", SERVER_NAME], { stdio: "inherit" });
}

function updateServer() {
    console.log("Updating server...");

    return spawn("bash", ["update.sh"], {
        stdio: "inherit",
        detached: true // Runs in the background
    });
}

function restartServer() {
    stopServer().on("exit", () => {
        updateServer().on("exit", () => {
            startServer();
        });
    });
}

// **👂 Listen for Update Requests from PM2**
process.on("message", (msg) => {
    if (msg === "update") {
        console.log("Update request received...");
        restartServer();
    }
});

// Start watchdog
console.log("Watchdog started...");
