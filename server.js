// ---- REQUIRES ---- //
const fs = require("./utils/fs_wrapper"); // Used for interacting with the filesystem
const crypto = require("crypto");       // Used for generating ids
const express = require("express");     // Used as the backend for the server

const ERR_HTML = `<!DOCTYPE html><html><head><title>400 Bad Request</title></head><body><h1>400 Bad Request</h1></body></html>`;

const app = express();                  // Creates an instance of the server            

const port = parseInt(process.argv[2]); // Reads the command line arguments, parseInt converts it to a number
if (0 > port || port > 65536) {         // Valid port range is 1-65535 
    throw("Invalid port number (valid range: 1 => 65535)");     // Creates an error
}

app.use("/static", express.static(`${__dirname}/public`));           // Tells express to serve all files in the 'public' directory at '/static'
app.use(express.json());                                            // Allows express to read JSON

app.get("/", async function(req, res) {                                   // GET request to '/'
    res.writeHead(200, {"Content-Type": "text/html"});              // Status 200 - OK (HTML body)
    res.end(await fs.readFile("pages/index.html") ?? ERR_HTML);           // Return HTML page or Error page
})

let IDS = [];
const MY_PIN = "xxxxxx";

app.post("/auth", async function (req, res) {
    const id = crypto.randomBytes(64).toString("hex");
    if (req.body.pin == MY_PIN) IDS.push(id);                   // Add 'id' to the list of valid ids
    res.writeHead(200, {"Content-Type": "application/json"});   // Status 200 - OK (JSON body)
    res.end(JSON.stringify({ id }));            // Sends { "id": "generated_id_here" } to the browser
})

app.get("/next", async function (req, res) {
        if (IDS.indexOf(req.query.id) !== -1) {                     // If the id specified is in IDS...
        IDS = IDS.filter(v => v != req.query.id);                   // Remove it from IDS...
        res.writeHead(200, {"Content-Type": "text/html"});          // Status 200 - OK (HTML body)
        res.end(await fs.readFile("pages/nextpage.html") ?? ERR_HTML);    // And serve the next http page to the browser
    } else {
        res.redirect("/");                      // Otherwise, send them back to the login page
    }
})

app.listen(port, function () { console.log(`Running on port ${port}`) }); // Start the server