
const BCMPhase = {
    backupSelections: new Map(), // assetId -> selection

    init() {
        this.backupSelections.clear();
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

        // Header
        const header = document.createElement("div");
        header.style.flexShrink = "0";
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0;">BUSINESS CONTINUITY</h2>
                <h2 style="margin:0; color:#bb0000;">SCORE: ${player.score}</h2>
            </div>
            <p>Select backup strategies. WARNING: Avoid Single Points of Failure.</p>
        `;
        panel.appendChild(header);

        // Content
        const list = document.createElement("div");
        list.style.overflowY = "auto";
        list.style.height = "300px";
        list.style.border = "1px solid #00bb00";
        list.style.padding = "20px";

        player.inventory.forEach(asset => {
            const row = document.createElement("div");
            row.className = "row";
            row.style.alignItems = "center";

            const label = document.createElement("span");
            label.innerText = asset.name;
            label.style.flex = "1";

            const select = document.createElement("select");
            select.style.flex = "1";
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
            alert("Please select a backup strategy for all assets.");
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
                alert(`SECURITY WARNING: You selected ${val} for ${assetName}.\n\nWHY IT MATTERS: Local backups/USBs are Single Points of Failure and easily destroyed by physical damage (fire, flood) or ransomware.`);
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
        panel.style.display = "block"; // Override flex for simpler scrolling layout

        // Grade Calculation
        let grade = "F";
        if (player.score > 350) grade = "A";
        else if (player.score > 250) grade = "B";
        else if (player.score > 150) grade = "C";
        else if (player.score > 50) grade = "D";

        const color = (grade === "A" || grade === "B") ? "#00ff00" : (grade === "C" ? "#ffff00" : "#ff0000");

        // Header
        panel.innerHTML = `
            <div style="border-bottom: 2px solid #00bb00; padding: 20px; margin-bottom: 20px;">
                <h1 style="font-size: 3em; color: ${color}; margin: 0;">AUDIT COMPLETED</h1>
                <h2 style="margin: 10px 0;">FINAL SECURITY RATING: <span style="font-size: 1.5em; border: 3px solid ${color}; padding: 5px 15px; border-radius: 5px;">${grade}</span></h2>
                <p>TOTAL SCORE: ${player.score}</p>
            </div>
        `;

        // Breakdown Table
        const table = document.createElement("table");
        table.style.width = "80%";
        table.style.margin = "0 auto";
        table.style.borderCollapse = "collapse";
        table.style.border = "1px solid #333";

        const phases = [
            { name: "Field Asset Collection", score: player.phaseScores.inventory },
            { name: "Vulnerability Patching", score: player.phaseScores.patching },
            { name: "Access Control Review", score: player.phaseScores.access },
            { name: "Disaster Recovery Planning", score: player.phaseScores.bcm }
        ];

        let rows = `<tr><th style="border:1px solid #333; padding:10px; color:#00bb00;">PHASE</th><th style="border:1px solid #333; padding:10px; color:#00bb00;">SCORE</th></tr>`;
        phases.forEach(p => {
            rows += `<tr><td style="border:1px solid #333; padding:8px;">${p.name}</td><td style="border:1px solid #333; padding:8px;">${p.score}</td></tr>`;
        });
        table.innerHTML = rows;
        panel.appendChild(table);

        // Failures / Incidents Log
        if (player.incidents.length > 0) {
            const incidentDiv = document.createElement("div");
            incidentDiv.style.marginTop = "30px";
            incidentDiv.style.textAlign = "left";
            incidentDiv.style.border = "1px solid #ff0000";
            incidentDiv.style.padding = "20px";
            incidentDiv.style.width = "80%";
            incidentDiv.style.marginLeft = "auto";
            incidentDiv.style.marginRight = "auto";

            incidentDiv.innerHTML = `<h3 style="color: #ff0000; margin-top:0;">SECURITY INCIDENTS LOG:</h3>`;
            const ul = document.createElement("ul");
            player.incidents.forEach(inc => {
                const li = document.createElement("li");
                li.innerText = inc;
                li.style.color = "#ff5555";
                li.style.marginBottom = "5px";
                ul.appendChild(li);
            });
            incidentDiv.appendChild(ul);
            panel.appendChild(incidentDiv);
        } else {
            const perfectDiv = document.createElement("div");
            perfectDiv.style.marginTop = "30px";
            perfectDiv.innerHTML = `<h3 style="color: #00ff00;">NO SECURITY INCIDENTS DETECTED. EXCELLENT WORK.</h3>`;
            panel.appendChild(perfectDiv);
        }

        // Restart
        const restart = document.createElement("button");
        restart.innerText = "INITIALIZE NEW SESSION";
        restart.style.marginTop = "30px";
        restart.style.marginBottom = "30px";
        restart.style.fontSize = "1.2em";
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
        lbDiv.style.borderTop = "2px dashed #00bb00";
        lbDiv.style.paddingTop = "20px";
        lbDiv.innerHTML = `<h2 style="color: #00ffaa;">TOP 5 SECURITY EXPERTS</h2>`;

        const lbTable = document.createElement("table");
        lbTable.style.width = "60%";
        lbTable.style.margin = "0 auto";
        lbTable.style.borderCollapse = "collapse";

        let lbRows = `<tr>
            <th style="border-bottom:1px solid #333; padding:5px; color:#555;">RANK</th>
            <th style="border-bottom:1px solid #333; padding:5px; color:#555;">OPERATOR</th>
            <th style="border-bottom:1px solid #333; padding:5px; color:#555;">SCORE</th>
            <th style="border-bottom:1px solid #333; padding:5px; color:#555;">GRADE</th>
        </tr>`;

        leaderboard.forEach((entry, i) => {
            lbRows += `<tr>
                <td style="padding:8px;">#${i + 1}</td>
                <td style="padding:8px;">${entry.name}</td>
                <td style="padding:8px;">${entry.score}</td>
                <td style="padding:8px;">${entry.grade}</td>
            </tr>`;
        });

        lbTable.innerHTML = lbRows;
        lbDiv.appendChild(lbTable);

        panel.appendChild(lbDiv);
        panel.appendChild(restart);
        ui.appendChild(panel);
    }
};
