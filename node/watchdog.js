const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3001; // Choose a different port for the update server

app.use(express.json());

app.get('/update', (req, res) => {
    console.log("Starting Update...");

    // Start the update process in the background
    const updateProcess = spawn("bash", ["update.sh"], {
        detached: true,  // Runs the script as a separate process
        stdio: "ignore", // Prevents Node from waiting for output
        env: process.env // Pass the environment variables
    });

    updateProcess.unref(); // Ensures Node doesn’t track the process

    updateProcess.on('exit', (code) => {
        if (code === 0) {
            console.log("Update completed successfully.");
            res.send("Update completed successfully.");
        } else {
            console.error(`Update process failed with exit code: ${code}`);
            res.status(500).send(`Update process failed with exit code: ${code}`);
        }
    });

    updateProcess.on('error', (err) => {
        console.error("Error spawning update process:", err);
        res.status(500).send("Error spawning update process.");
    });
});

app.listen(port, () => {
    console.log(`Update server running at http://localhost:${port}`);
});