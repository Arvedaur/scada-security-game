
const ResultsPhase = {
    leaderboard: [
        { name: "Per E**rs", score: 2500, grade: "A++", date: "2026-03-01" },
        { name: "CyberSentinel", score: 1150, grade: "A+", date: "2026-02-28" },
        { name: "GridGuardian", score: 980, grade: "A", date: "2026-03-05" },
        { name: "RootUser_01", score: 850, grade: "B+", date: "2026-03-02" },
        { name: "TechWizard", score: 720, grade: "B", date: "2026-02-15" }
    ],

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

        // 3. Score Breakdown (Detailed)
        const breakdown = document.createElement("div");
        breakdown.style.background = "rgba(57, 255, 20, 0.05)";
        breakdown.style.border = "1px solid #39ff14";
        breakdown.style.padding = "25px";
        breakdown.style.width = "85%";
        breakdown.style.margin = "0 auto 20px auto";
        breakdown.style.textAlign = "left";
        breakdown.style.fontSize = "18px";

        const idsStats = player.idsStats || { blocked: 0, missed: 0, correctDecisions: 0, falsePos: 0 };
        const accStats = player.accessStats || { correct: 0, incorrect: 0 };
        const bcmStats = player.bcmStats || { strong: 0, weak: 0, paper: 0 };

        breakdown.innerHTML = `
            <h2 style="color:#39ff14; margin-top:0; border-bottom: 2px solid #39ff14;">OPERATIONAL ACHIEVEMENTS:</h2>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <h3 style="color:#00fbff;">[1] ASSET & PATCHING</h3>
                    <p style="margin:5px 0;">- Registry: ${player.phaseScores.inventory} PTS</p>
                    <p style="margin:5px 0;">- Remediation: ${player.phaseScores.patching} PTS</p>
                </div>
                <div>
                    <h3 style="color:#00fbff;">[2] ACCESS CONTROL</h3>
                    <p style="margin:5px 0;">- Valid Approvals/Denies: ${accStats.correct}</p>
                    <p style="margin:5px 0;">- Security Violations: ${accStats.incorrect}</p>
                </div>
                <div>
                    <h3 style="color:#00fbff;">[3] IDS MONITORING</h3>
                    <p style="margin:5px 0;">- Threats Detained: ${idsStats.blocked}</p>
                    <p style="margin:5px 0;">- Traffic Decisions: ${idsStats.correctDecisions}</p>
                    <p style="margin:5px 0;">- False Positives: ${idsStats.falsePos}</p>
                </div>
                <div>
                    <h3 style="color:#00fbff;">[4] DISASTER RECOVERY</h3>
                    <p style="margin:5px 0;">- Resilient Backups: ${bcmStats.strong}</p>
                    <p style="margin:5px 0;">- Weak Points: ${bcmStats.weak}</p>
                </div>
            </div>
            
            <hr style="border:0; border-top:1px dashed #39ff14; margin: 20px 0;">
            <div style="font-size: 22px; color: #fff; text-align: right;">
                FINAL INTEGRITY SCORE: <span style="color:#39ff14; font-weight:bold;">${totalScore} / 1200+</span>
            </div>
        `;
        panel.appendChild(breakdown);

        // 4. Actions
        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.justifyContent = "center";
        actions.style.gap = "20px";
        actions.style.marginBottom = "30px";

        const certBtn = document.createElement("button");
        certBtn.innerText = "GENERATE OFFICIAL CERTIFICATE (PDF)";
        certBtn.style.padding = "15px 30px";
        certBtn.style.fontSize = "20px";
        certBtn.style.borderColor = "#00fbff";
        certBtn.style.color = "#00fbff";
        certBtn.onclick = () => this.generatePDF(grade);

        const leaderBtn = document.createElement("button");
        leaderBtn.innerText = "VIEW GLOBAL LEADERBOARD";
        leaderBtn.style.padding = "15px 30px";
        leaderBtn.style.fontSize = "20px";
        leaderBtn.style.borderColor = "#ffae00";
        leaderBtn.style.color = "#ffae00";
        leaderBtn.onclick = () => this.renderLeaderboard();

        const restartBtn = document.createElement("button");
        restartBtn.innerText = "START NEW SHIFT";
        restartBtn.style.padding = "15px 30px";
        restartBtn.style.fontSize = "20px";
        restartBtn.style.borderColor = "#39ff14";
        restartBtn.style.color = "#39ff14";
        restartBtn.onclick = () => location.reload();

        actions.appendChild(certBtn);
        actions.appendChild(leaderBtn);
        actions.appendChild(restartBtn);
        panel.appendChild(actions);

        ui.appendChild(panel);
    },

    renderLeaderboard() {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.textAlign = "center";
        panel.style.maxWidth = "800px";
        panel.style.borderColor = "#ffae00";
        panel.style.boxShadow = "0 0 30px #ffae00";

        let boardHtml = `
            <h1 style="color:#ffae00; letter-spacing: 5px; margin-bottom: 30px;">GLOBAL COMMANDER LEADERBOARD</h1>
            <table style="width:100%; border-collapse: collapse; color: white; font-size: 20px; text-align: left;">
                <tr style="border-bottom: 2px solid #ffae00; color: #ffae00;">
                    <th style="padding: 15px;">RANK</th>
                    <th>OPERATOR</th>
                    <th>SCORE</th>
                    <th>GRADE</th>
                </tr>
        `;

        this.leaderboard.forEach((entry, i) => {
            const isTop = i === 0;
            boardHtml += `
                <tr style="border-bottom: 1px solid rgba(255,174,0,0.2); ${isTop ? 'background: rgba(255,174,0,0.1); color: #ffae00; font-weight: bold;' : ''}">
                    <td style="padding: 15px;">#${i + 1}</td>
                    <td>${entry.name} ${isTop ? '👑' : ''}</td>
                    <td>${entry.score.toString().padStart(6, '0')}</td>
                    <td>${entry.grade}</td>
                </tr>
            `;
        });

        boardHtml += `</table>
            <div style="margin-top: 40px; display: flex; gap: 20px; justify-content: center;">
                <button style="border-color:#39ff14; color:#39ff14;" onclick="ResultsPhase.render()">BACK TO REPORT</button>
                <button style="border-color:#ff2d44; color:#ff2d44;" onclick="location.reload()">MAIN MENU</button>
            </div>
        `;

        panel.innerHTML = boardHtml;
        ui.appendChild(panel);
    },

    generatePDF(grade) {
        const printWindow = window.open('', '_blank');
        const dateStr = new Date().toLocaleDateString();

        const idsStats = player.idsStats || { blocked: 0, missed: 0, correctDecisions: 0, falsePos: 0 };
        const accStats = player.accessStats || { correct: 0, incorrect: 0 };
        const bcmStats = player.bcmStats || { strong: 0, weak: 0, paper: 0 };

        // Generate QR Code data (Just a summary URL/String)
        const qrData = encodeURIComponent(`Operator:${player.name}|Score:${player.score}|Grade:${grade}|Date:${dateStr}`);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`;

        printWindow.document.write(`
            <html>
            <head>
                <title>SCADA Cyber Defender - Official Certification</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4; padding: 20px; color: #333; }
                    .cert { background: #fff; border: 20px solid #2c3e50; padding: 40px; position: relative; max-width: 900px; margin: 0 auto; box-shadow: 0 0 30px rgba(0,0,0,0.1); }
                    .header { font-size: 50px; font-weight: 800; color: #2c3e50; margin-bottom: 5px; }
                    .sub-header { font-size: 20px; color: #7f8c8d; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 2px; }
                    .content { font-size: 22px; line-height: 1.6; margin-bottom: 40px; }
                    .name { font-size: 45px; font-weight: bold; color: #e74c3c; margin: 20px 0; border-bottom: 3px solid #eee; display: inline-block; padding: 0 40px; }
                    
                    .stats-container { display: flex; justify-content: space-between; background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 40px; text-align: left; border: 1px solid #ddd; }
                    .stat-box h4 { margin: 0 0 10px 0; color: #2c3e50; border-bottom: 2px solid #e74c3c; display: inline-block; }
                    .stat-box p { margin: 5px 0; font-size: 16px; }

                    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; }
                    .qr-code { text-align: center; }
                    .qr-code img { border: 4px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .signature { text-align: right; }
                    .seal { font-weight: bold; font-style: italic; font-size: 14px; border: 2px solid #2c3e50; padding: 10px; margin-bottom: 10px; display: inline-block; color: #2c3e50; }
                    
                    @media print { body { background: #fff; padding: 0; } .cert { border: 15px solid #000; box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="cert">
                    <div class="header">CERTIFICATE</div>
                    <div class="sub-header">Of Cyber Security Excellence</div>
                    
                    <div class="content">
                        This is to officially recognize that<br>
                        <div class="name">${player.name || "UNAUTHORIZED OPERATOR"}</div><br>
                        has demonstrated superior proficiency in SCADA Protection Protocols, 
                        achieving a total system integrity rating of <strong>${grade}</strong>.
                    </div>

                    <div class="stats-container">
                        <div class="stat-box">
                            <h4>NETWORK IDS</h4>
                            <p>Threats Blocked: ${idsStats.blocked}</p>
                            <p>Correct Logic: ${idsStats.correctDecisions}</p>
                        </div>
                        <div class="stat-box">
                            <h4>ACCESS CONTROL</h4>
                            <p>Correct Reviews: ${accStats.correct}</p>
                            <p>Security Slips: ${accStats.incorrect}</p>
                        </div>
                        <div class="stat-box">
                            <h4>OPERATIONAL</h4>
                            <p>Final Score: ${player.score}</p>
                            <p>Grade: ${grade}</p>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="qr-code">
                            <img src="${qrUrl}" alt="Verification QR">
                            <div style="font-size: 10px; margin-top: 5px; color: #7f8c8d;">VERIFY CREDENTIAL</div>
                        </div>
                        <div class="signature">
                            <div class="seal">SCADA GRID DEFENSE AUTHORITY</div>
                            <div style="font-size: 14px; color: #7f8c8d;">Issued on: ${dateStr}</div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(() => window.print(), 1000);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
};
