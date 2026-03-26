const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin Login & Dashboard UI
const ui = (isDashboard = false) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZyTRAx TCP BOT</title>
    <style>
        body { background: #000; color: #0f0; font-family: monospace; text-align: center; padding: 20px; }
        .box { border: 2px solid #0f0; padding: 20px; border-radius: 10px; display: inline-block; width: 90%; max-width: 400px; box-shadow: 0 0 15px #0f0; }
        input { width: 80%; padding: 10px; margin: 10px 0; background: #111; border: 1px solid #0f0; color: #fff; }
        button { background: #0f0; color: #000; padding: 12px; width: 88%; border: none; cursor: pointer; font-weight: bold; margin-top: 10px; }
        #console { background: #111; color: #0f0; padding: 10px; height: 150px; overflow-y: auto; text-align: left; font-size: 12px; margin-top: 20px; border: 1px solid #333; }
    </style>
</head>
<body>
    <div class="box">
        <h2>${isDashboard ? 'ZYTRAX DASHBOARD' : 'ZYTRAX LOGIN'}</h2>
        ${isDashboard ? `
            <input type="text" id="uid" placeholder="Enter Guest UID">
            <input type="password" id="pass" placeholder="Guest Password/Token">
            <button onclick="startBot()">RUN TCP BOT</button>
            <div id="console">> Awaiting command...</div>
        ` : `
            <form action="/login" method="POST">
                <input type="text" name="u" placeholder="Admin (anis)">
                <input type="password" name="p" placeholder="Pass (1234)">
                <button type="submit">LOGIN</button>
            </form>
        `}
    </div>
    <script>
        function startBot() {
            const uid = document.getElementById('uid').value;
            const log = document.getElementById('console');
            log.innerHTML += "<br>> Starting Python Engine...";
            fetch('/run', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ uid: uid })
            }).then(r => r.json()).then(d => log.innerHTML += "<br>> " + d.msg);
        }
    </script>
</body>
</html>
`;

app.get('/', (req, res) => res.send(ui(false)));
app.post('/login', (req, res) => {
    if(req.body.u === 'anis' && req.body.p === '1234') res.send(ui(true));
    else res.send("Invalid! <a href='/'>Back</a>");
});

app.post('/run', (req, res) => {
    const { uid } = req.body;
    // আপনার পাইথন ফাইলটি রান করা হচ্ছে
    const bot = spawn('python3', ['main.py', uid]);
    bot.stdout.on('data', (d) => console.log(`Bot: ${d}`));
    res.json({ msg: `Bot online for UID: ${uid}. Check Render Logs.` });
});

app.listen(process.env.PORT || 3000);

