
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
        header.innerHTML = `
            <h2>BUSINESS CONTINUITY & DISASTER RECOVERY</h2>
            <p>Select backup strategies for each critical asset.</p>
            <p>WARNING: Avoid Single Points of Failure (Local/USB).</p>
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
        let correctBackups = 0;
        this.backupSelections.forEach((val, key) => {
            if (val === "OFFSITE_NAS" || val === "SECURE_CLOUD") {
                correctBackups++;
                player.score += 30;
            } else if (val === "LOCAL_SERVER" || val === "USB_DRIVE") {
                player.score -= 15; // Penalty for bad backups
            } else {
                // Paper is neutral/low points
                player.score += 5;
            }
        });

        // Final Score Check
        // Threshold: Let's say 200? The user collects assets (approx 100-200), patches (approx 100-200), access (150).
        // Let's set a threshold of 300 for winning.
        const threshold = 300;
        const win = player.score >= threshold;

        this.showEndScreen(win);
    },

    showEndScreen(win) {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.textAlign = "center";
        panel.style.height = "auto";

        const h1 = document.createElement("h1");
        h1.innerText = win ? "MISSION ACCOMPLISHED" : "SYSTEM COMPROMISED";
        h1.style.color = win ? "#00ff00" : "#ff0000";
        h1.style.fontSize = "40px";

        const score = document.createElement("h2");
        score.innerText = `FINAL SECURITY SCORE: ${player.score}`;

        const msg = document.createElement("p");
        msg.innerText = win
            ? "Constructive defense protocols successfully implemented. Critical infrastructure secured."
            : "Critical vulnerabilities remained exposed. System integrity integrity failed.";

        const restart = document.createElement("button");
        restart.innerText = "RESTART SIMULATION";
        restart.onclick = () => location.reload();

        panel.appendChild(h1);
        panel.appendChild(score);
        panel.appendChild(msg);
        panel.appendChild(restart);

        ui.appendChild(panel);
    }
};
