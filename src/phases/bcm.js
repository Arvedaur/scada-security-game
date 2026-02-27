
const BCMPhase = {
    backupSelections: new Map(), // assetId -> selection
    initialized: false,

    init() {
        this.backupSelections.clear();
        this.initialized = true;
    },

    render() {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";
        ui.classList.remove("hidden");

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.gap = "20px";
        panel.style.borderColor = "var(--retro-green)";
        panel.style.borderWidth = "4px";
        panel.style.boxShadow = "0 0 20px var(--retro-green)";

        // Header
        const header = document.createElement("div");
        header.style.flexShrink = "0";
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; color:var(--retro-green); text-shadow:0 0 15px var(--retro-green);">BUSINESS CONTINUITY</h2>
                <h2 style="margin:0; color:white; text-shadow:0 0 5px var(--retro-green);">SCORE: ${player.score}</h2>
            </div>
            <p style="color:var(--retro-green);">Select backup strategies. WARNING: Avoid Single Points of Failure.</p>
        `;
        panel.appendChild(header);

        // Content
        const list = document.createElement("div");
        list.style.overflowY = "auto";
        list.style.height = "300px";
        list.style.border = "1px solid rgba(255, 174, 0, 0.3)";
        list.style.padding = "20px";
        list.style.background = "rgba(255, 174, 0, 0.02)";

        player.inventory.forEach(asset => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.marginBottom = "15px";
            row.style.padding = "5px";
            row.style.borderBottom = "1px solid rgba(255, 174, 0, 0.1)";

            const label = document.createElement("span");
            label.innerText = asset.name;
            label.style.color = "var(--neon-cyan)";
            label.style.flex = "1";

            const select = document.createElement("select");
            select.style.flex = "1";
            select.style.background = "#000";
            select.style.color = "var(--neon-yellow)";
            select.style.border = "1px solid var(--neon-yellow)";
            select.style.padding = "5px";
            select.innerHTML = `
                <option value="">-- SELECT BACKUP LOCATION --</option>
                <option value="LOCAL_SERVER">Local Server Partition</option>
                <option value="USB_DRIVE">Connected USB Drive</option>
                <option value="OFFSITE_NAS">Offsite NAS (Encrypted)</option>
                <option value="SECURE_CLOUD">Secure Cloud Storage</option>
                <option value="PAPER">Printed Logs</option>
            `;

            // Restore previous selection if any
            if (this.backupSelections.has(asset.id)) {
                select.value = this.backupSelections.get(asset.id);
            }

            select.onchange = (e) => {
                this.backupSelections.set(asset.id, e.target.value);
            };

            row.appendChild(label);
            row.appendChild(select);
            list.appendChild(row);
        });

        panel.appendChild(list);

        // Footer: Finalize
        const footer = document.createElement("div");
        footer.style.textAlign = "center";
        const finishBtn = document.createElement("button");
        finishBtn.innerText = "INITIATE DISASTER RECOVERY PLAN >>";
        finishBtn.style.color = "var(--neon-yellow)";
        finishBtn.style.borderColor = "var(--neon-yellow)";
        finishBtn.style.fontSize = "1.1em";
        finishBtn.style.boxShadow = "0 0 10px var(--neon-yellow)";
        finishBtn.onclick = () => {
            this.evaluateAndFinish();
        };
        footer.appendChild(finishBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);
    },

    evaluateAndFinish() {
        // Check if all selected
        if (this.backupSelections.size < player.inventory.length) {
            showStatusMessage("Please select a backup strategy for all assets.");
            return;
        }

        // Scoring
        this.backupSelections.forEach((val, key) => {
            if (val === "OFFSITE_NAS" || val === "SECURE_CLOUD") {
                player.score += 30;
                player.phaseScores.bcm += 30;
            } else if (val === "LOCAL_SERVER" || val === "USB_DRIVE") {
                player.score -= 15;
                player.phaseScores.bcm -= 15;

                // Incident Log
                let assetName = player.inventory.find(a => a.id === key)?.name || "Unknown";
                player.incidents.push(`Weak Backup Strategy for ${assetName}`);

                // Immediate Tooltip
                showStatusMessage(`SECURITY WARNING: ${val} for ${assetName}.\nWHY IT MATTERS: Single Point of Failure risk.`, 5000);
            } else {
                // Paper
                player.score += 5;
                player.phaseScores.bcm += 5;
            }
        });

        this.showEndScreen();
    },

    showEndScreen() {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.textAlign = "center";
        panel.style.overflowY = "auto";
        panel.style.display = "block";
        panel.style.borderColor = "var(--retro-green)";
        panel.style.borderWidth = "4px";
        panel.style.boxShadow = "0 0 25px var(--retro-green)";

        // Grade Calculation
        let grade = "F";
        if (player.score > 350) grade = "A";
        else if (player.score > 250) grade = "B";
        else if (player.score > 150) grade = "C";
        else if (player.score > 50) grade = "D";

        const color = (grade === "A" || grade === "B") ? "var(--retro-green)" : (grade === "C" ? "var(--neon-yellow)" : "var(--neon-red)");

        // Header
        panel.innerHTML = `
            <div style="border-bottom: 3px solid var(--retro-green); padding: 20px; margin-bottom: 20px;">
                <h1 style="font-size: 3em; color: ${color}; text-shadow:0 0 20px ${color}; margin: 0;">AUDIT COMPLETED</h1>
                <h2 style="margin: 10px 0; color:#fff; text-shadow:none;">FINAL SECURITY RATING: <span style="font-size: 1.5em; border: 4px solid ${color}; padding: 5px 15px; border-radius: 5px; color:${color}; text-shadow: 0 0 15px ${color};">${grade}</span></h2>
                <p style="color:var(--retro-green); font-weight:bold;">TOTAL SCORE: ${player.score.toString().padStart(6, '0')}</p>
            </div>
        `;

        // Breakdown Table
        const table = document.createElement("table");
        table.style.width = "80%";
        table.style.margin = "0 auto";
        table.style.borderCollapse = "collapse";
        table.style.border = "1px solid rgba(0, 251, 255, 0.2)";

        const phases = [
            { name: "Field Asset Collection", score: player.phaseScores.inventory },
            { name: "Vulnerability Patching", score: player.phaseScores.patching },
            { name: "Access Control Review", score: player.phaseScores.access },
            { name: "Disaster Recovery Planning", score: player.phaseScores.bcm }
        ];

        let rows = `<tr><th style="border:1px solid rgba(0, 251, 255, 0.2); padding:10px; color:var(--neon-cyan);">PHASE</th><th style="border:1px solid rgba(0, 251, 255, 0.2); padding:10px; color:var(--neon-cyan);">SCORE</th></tr>`;
        phases.forEach(p => {
            rows += `<tr><td style="border:1px solid rgba(0, 251, 255, 0.2); padding:8px; color:#fff;">${p.name}</td><td style="border:1px solid rgba(0, 251, 255, 0.2); padding:8px; color:var(--neon-green);">${p.score}</td></tr>`;
        });
        table.innerHTML = rows;
        panel.appendChild(table);

        // Failures / Incidents Log
        if (player.incidents.length > 0) {
            const incidentDiv = document.createElement("div");
            incidentDiv.style.marginTop = "30px";
            incidentDiv.style.textAlign = "left";
            incidentDiv.style.border = "1px solid var(--neon-red)";
            incidentDiv.style.padding = "20px";
            incidentDiv.style.width = "80%";
            incidentDiv.style.marginLeft = "auto";
            incidentDiv.style.marginRight = "auto";
            incidentDiv.style.background = "rgba(255, 45, 68, 0.05)";

            incidentDiv.innerHTML = `<h3 style="color: var(--neon-red); margin-top:0; text-shadow:0 0 10px var(--neon-red);">SECURITY INCIDENTS LOG:</h3>`;
            const ul = document.createElement("ul");
            player.incidents.forEach(inc => {
                const li = document.createElement("li");
                li.innerText = inc;
                li.style.color = "#ff8888";
                li.style.marginBottom = "5px";
                ul.appendChild(li);
            });
            incidentDiv.appendChild(ul);
            panel.appendChild(incidentDiv);
        } else {
            const perfectDiv = document.createElement("div");
            perfectDiv.style.marginTop = "30px";
            perfectDiv.innerHTML = `<h3 style="color: var(--neon-green); text-shadow:0 0 10px var(--neon-green);">NO SECURITY INCIDENTS DETECTED. EXCELLENT WORK.</h3>`;
            panel.appendChild(perfectDiv);
        }

        // Restart
        const restart = document.createElement("button");
        restart.innerText = "INITIALIZE NEW SESSION";
        restart.style.marginTop = "30px";
        restart.style.marginBottom = "30px";
        restart.style.fontSize = "1.2em";
        restart.style.borderColor = "var(--neon-cyan)";
        restart.style.color = "var(--neon-cyan)";
        restart.onclick = () => location.reload();

        // --- LEADERBOARD LOGIC ---
        const LB_KEY = "scada_leaderboard";
        let leaderboard = JSON.parse(localStorage.getItem(LB_KEY) || "[]");

        // Add current score
        leaderboard.push({
            name: player.name || "OPERATOR",
            score: player.score,
            grade: grade,
            date: new Date().toLocaleDateString()
        });

        // Sort & Slice
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);

        // Save
        localStorage.setItem(LB_KEY, JSON.stringify(leaderboard));

        // --- LEADERBOARD UI ---
        const lbDiv = document.createElement("div");
        lbDiv.style.marginTop = "40px";
        lbDiv.style.borderTop = "2px dashed rgba(0, 251, 255, 0.5)";
        lbDiv.style.paddingTop = "20px";
        lbDiv.innerHTML = `<h2 style="color: var(--neon-cyan); text-shadow:0 0 10px var(--neon-cyan);">TOP 5 SECURITY EXPERTS</h2>`;

        const lbTable = document.createElement("table");
        lbTable.style.width = "60%";
        lbTable.style.margin = "0 auto";
        lbTable.style.borderCollapse = "collapse";

        let lbRows = `<tr>
            <th style="border-bottom:1px solid rgba(0, 251, 255, 0.2); padding:5px; color:var(--neon-yellow);">RANK</th>
            <th style="border-bottom:1px solid rgba(0, 251, 255, 0.2); padding:5px; color:var(--neon-yellow);">OPERATOR</th>
            <th style="border-bottom:1px solid rgba(0, 251, 255, 0.2); padding:5px; color:var(--neon-yellow);">SCORE</th>
            <th style="border-bottom:1px solid rgba(0, 251, 255, 0.2); padding:5px; color:var(--neon-yellow);">GRADE</th>
        </tr>`;

        leaderboard.forEach((entry, i) => {
            lbRows += `<tr>
                <td style="padding:8px; color:#fff;">#${i + 1}</td>
                <td style="padding:8px; color:#fff;">${entry.name}</td>
                <td style="padding:8px; color:var(--neon-green);">${entry.score}</td>
                <td style="padding:8px; color:var(--neon-cyan);">${entry.grade}</td>
            </tr>`;
        });

        lbTable.innerHTML = lbRows;
        lbDiv.appendChild(lbTable);

        panel.appendChild(lbDiv);
        panel.appendChild(restart);
        ui.appendChild(panel);
    }
};
