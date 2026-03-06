
const ResultsPhase = {
    render() {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";
        ui.classList.remove("hidden");

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.textAlign = "center";
        panel.style.overflowY = "auto";
        panel.style.display = "block";
        panel.style.borderColor = "#39ff14";
        panel.style.borderWidth = "4px";
        panel.style.boxShadow = "0 0 25px #39ff14";

        // Scoring Thresholds
        const totalScore = player.score;
        let grade = "F";
        let headline = "CRITICAL ALERT: SYSTEM UNDER GRADUAL ATTACK";
        let headlineColor = "#ff2d44";

        if (totalScore >= 600) {
            grade = "A+";
            headline = "SYSTEM SECURED: INFRASTRUCTURE HARDENED";
            headlineColor = "#39ff14";
        } else if (totalScore >= 450) {
            grade = "A";
            headline = "OPERATIONAL STABILITY: OPTIMAL";
            headlineColor = "#39ff14";
        } else if (totalScore >= 300) {
            grade = "B";
            headline = "DUE DILIGENCE MET: SYSTEM STABLE";
            headlineColor = "#ffae00";
        } else if (totalScore >= 150) {
            grade = "C";
            headline = "VULNERABILITIES DETECTED: MINIMAL DEFENSE";
            headlineColor = "#ffae00";
        }

        // 1. Headline (News style)
        const newsHeader = document.createElement("div");
        newsHeader.style.background = headlineColor;
        newsHeader.style.color = "#000";
        newsHeader.style.padding = "10px";
        newsHeader.style.fontWeight = "bold";
        newsHeader.style.fontSize = "24px";
        newsHeader.style.marginBottom = "20px";
        newsHeader.innerText = headline;
        panel.appendChild(newsHeader);

        // 2. Main Stats
        const mainStats = document.createElement("div");
        mainStats.innerHTML = `
            <h1 style="color:#fff; margin:0;">MISSION REPORT</h1>
            <p style="color:#39ff14; font-size:1.2em;">OPERATOR: ${player.name || "UNAUTHORIZED"}</p>
            <div style="font-size: 3em; color: ${headlineColor}; font-weight:bold; margin: 10px 0;">
                SCORE: ${totalScore.toString().padStart(6, '0')}
            </div>
            <div style="font-size: 1.5em; color: #fff; margin-bottom:20px;">
                RATING: <span style="border:2px solid ${headlineColor}; padding:5px 15px; color:${headlineColor};">${grade}</span>
            </div>
        `;
        panel.appendChild(mainStats);

        // 3. Score Breakdown
        const breakdown = document.createElement("div");
        breakdown.style.background = "rgba(57, 255, 20, 0.05)";
        breakdown.style.border = "1px solid #39ff14";
        breakdown.style.padding = "15px";
        breakdown.style.width = "80%";
        breakdown.style.margin = "0 auto 20px auto";
        breakdown.style.textAlign = "left";

        breakdown.innerHTML = `
            <h3 style="color:#39ff14; margin-top:0;">PHASE BREAKDOWN:</h3>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>Asset Inventory:</span> <span style="font-weight:bold; color:#00fbff;">${player.phaseScores.inventory} pts</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>Patch Management:</span> <span style="font-weight:bold; color:#00fbff;">${player.phaseScores.patching} pts</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>Access Control:</span> <span style="font-weight:bold; color:#00fbff;">${player.phaseScores.access} pts</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>Disaster Recovery:</span> <span style="font-weight:bold; color:#00fbff;">${player.phaseScores.bcm} pts</span>
            </div>
            <hr style="border:0; border-top:1px dashed #39ff14;">
        `;
        panel.appendChild(breakdown);

        // 4. Actions
        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.justifyContent = "center";
        actions.style.gap = "20px";
        actions.style.marginBottom = "30px";

        const certBtn = document.createElement("button");
        certBtn.innerText = "GENERATE CERTIFICATE (PDF)";
        certBtn.style.borderColor = "#00fbff";
        certBtn.style.color = "#00fbff";
        certBtn.onclick = () => this.generatePDF();

        const restartBtn = document.createElement("button");
        restartBtn.innerText = "NEW MISSION";
        restartBtn.style.borderColor = "#39ff14";
        restartBtn.style.color = "#39ff14";
        restartBtn.onclick = () => location.reload();

        actions.appendChild(certBtn);
        actions.appendChild(restartBtn);
        panel.appendChild(actions);

        ui.appendChild(panel);
    },

    generatePDF() {
        // Create a hidden container for printing
        const printWindow = window.open('', '_blank');
        const dateStr = new Date().toLocaleDateString();

        printWindow.document.write(`
            <html>
            <head>
                <title>SCADA Cyber Defender - Certification</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; background: #fff; padding: 50px; text-align: center; }
                    .cert { border: 15px solid #000; padding: 50px; position: relative; }
                    .header { font-size: 40px; font-weight: bold; margin-bottom: 20px; text-decoration: underline; }
                    .sub { font-size: 20px; margin-bottom: 40px; }
                    .name { font-size: 35px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #333; display: inline-block; padding: 0 50px; }
                    .score { font-size: 25px; margin-top: 50px; }
                    .date { font-size: 18px; margin-top: 20px; color: #666; }
                    .seal { margin-top: 50px; font-weight: bold; font-style: italic; border: 2px solid #000; display: inline-block; padding: 10px; }
                    @media print { button { display: none; } }
                </style>
            </head>
            <body>
                <div class="cert">
                    <div class="header">CERTIFICATE OF COMPLETION</div>
                    <div class="sub">This hereby certifies that the operator</div>
                    <div class="name">${player.name || "ANONYMOUS"}</div>
                    <div class="sub">has successfully completed the SCADA Security Audit</div>
                    <div class="score">FINAL ASSESSMENT SCORE: <strong>${player.score}</strong></div>
                    <div class="date">Issued on: ${dateStr}</div>
                    <div class="seal">SCADA GRID DEFENSE AUTHORITY</div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        // Optional: window.close();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
};
