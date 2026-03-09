
const BCMPhase = {
    backupSelections: new Map(), // assetId -> selection
    initialized: false,
    stats: { strong: 0, weak: 0, paper: 0 },

    init() {
        this.backupSelections.clear();
        this.initialized = true;
        this.stats = { strong: 0, weak: 0, paper: 0 };
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
                <div style="display:flex; align-items:center; gap:20px;">
                    <h2 style="margin:0; color:white; text-shadow:0 0 5px var(--retro-green);">SCORE: ${player.score}</h2>
                    <div id="bcm-help-btn" style="width:30px; height:30px; border:2px solid var(--retro-green); color:var(--retro-green); display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size:20px;">?</div>
                </div>
            </div>
            <p style="color:var(--retro-green);">Select backup strategies. WARNING: Avoid Single Points of Failure.</p>
        `;
        panel.appendChild(header);

        // Add help click handler
        setTimeout(() => {
            const btn = document.getElementById("bcm-help-btn");
            if (btn) btn.onclick = () => HelpSystem.showHelp();
        }, 0);

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
            label.style.fontSize = "20px";

            const select = document.createElement("select");
            select.style.flex = "1";
            select.style.background = "#000";
            select.style.color = "var(--neon-yellow)";
            select.style.border = "1px solid var(--neon-yellow)";
            select.style.padding = "10px";
            select.style.fontSize = "18px";
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
                this.stats.strong++;
            } else if (val === "LOCAL_SERVER" || val === "USB_DRIVE") {
                player.score -= 15;
                player.phaseScores.bcm -= 15;
                this.stats.weak++;

                // Incident Log
                let assetName = player.inventory.find(a => a.id === key)?.name || "Unknown";
                player.incidents.push(`Weak Backup Strategy for ${assetName}`);

                // Immediate Tooltip
                showStatusMessage(`SECURITY WARNING: ${val} for ${assetName}.\nWHY IT MATTERS: Single Point of Failure risk.`, 5000);
            } else {
                // Paper
                player.score += 5;
                player.phaseScores.bcm += 5;
                this.stats.paper++;
            }
        });

        player.bcmStats = { ...this.stats }; // Save for certificate
        currentState = GameState.RESULTS;
    }
};
