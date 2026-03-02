
const InventoryPhase = {
    isFrozen: false,

    init() {
        // Any setup if needed
    },

    render() {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";
        ui.classList.remove("hidden");

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.width = "95%";
        panel.style.height = "90%";
        panel.style.borderColor = "var(--retro-green)";
        panel.style.borderWidth = "4px";
        panel.style.boxShadow = "0 0 20px var(--retro-green)";

        const titleContainer = document.createElement("div");
        titleContainer.style.display = "flex";
        titleContainer.style.justifyContent = "space-between";
        titleContainer.style.alignItems = "center";
        titleContainer.style.marginBottom = "20px";

        const title = document.createElement("h2");
        title.innerText = "CRITICAL ASSET REGISTER (VERIFIED)";
        title.style.color = "var(--retro-green)";
        title.style.textShadow = "0 0 15px var(--retro-green)";
        title.style.margin = "0";
        titleContainer.appendChild(title);

        const helpBtn = document.createElement("div");
        helpBtn.innerText = "?";
        helpBtn.style.width = "40px";
        helpBtn.style.height = "40px";
        helpBtn.style.border = "2px solid var(--retro-green)";
        helpBtn.style.color = "var(--retro-green)";
        helpBtn.style.display = "flex";
        helpBtn.style.justifyContent = "center";
        helpBtn.style.alignItems = "center";
        helpBtn.style.cursor = "pointer";
        helpBtn.style.fontWeight = "bold";
        helpBtn.style.fontSize = "24px";
        helpBtn.onclick = () => HelpSystem.showHelp();
        titleContainer.appendChild(helpBtn);

        panel.appendChild(titleContainer);

        if (player.inventory.length === 0) {
            const msg = document.createElement("p");
            msg.innerText = "WARNING: NO ASSETS SECURED. SYSTEM ENUMERATION FAILED.";
            msg.style.color = "var(--neon-red)";
            msg.style.fontSize = "24px";
            msg.style.textAlign = "center";
            msg.style.marginTop = "100px";
            panel.appendChild(msg);
        } else {
            const tableContainer = document.createElement("div");
            tableContainer.style.overflowY = "auto";
            tableContainer.style.flexGrow = "1";
            tableContainer.style.border = "1px solid rgba(57, 255, 20, 0.3)";

            const table = document.createElement("table");
            table.style.width = "100%";
            table.style.borderCollapse = "collapse";
            table.style.fontFamily = "monospace";
            table.style.fontSize = "14px";

            const thead = document.createElement("thead");
            thead.style.background = "rgba(57, 255, 20, 0.1)";
            thead.style.position = "sticky";
            thead.style.top = "0";
            thead.innerHTML = `
                <tr>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">ID</th>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">ASSET NAME</th>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">VENDOR</th>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">AGE</th>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">IP ADDR</th>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">MAC ADDR</th>
                    <th style="padding:12px; border:1px solid var(--retro-green); color:var(--retro-green); text-align:left;">FIRMWARE</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            player.inventory.forEach(item => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
                const d = item.details || { vendor: "Unknown", age: "N/A", fw: "N/A", ip: "N/A", mac: "N/A" };
                tr.innerHTML = `
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:#fff;">${item.id}</td>
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:var(--neon-cyan);">${item.name}</td>
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:#fff;">${d.vendor}</td>
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:#aaa;">${d.age}</td>
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:var(--neon-yellow);">${d.ip}</td>
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:#fff;">${d.mac}</td>
                    <td style="padding:10px; border:1px solid rgba(57, 255, 20, 0.2); color:var(--neon-cyan);">${d.fw}</td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            panel.appendChild(tableContainer);
        }

        const controls = document.createElement("div");
        controls.style.marginTop = "20px";
        controls.style.textAlign = "center";
        controls.style.padding = "10px";

        const backBtn = document.createElement("button");
        backBtn.innerText = "RETURN TO FIELD OPERATIONS";
        backBtn.style.color = "var(--neon-cyan)";
        backBtn.style.borderColor = "var(--neon-cyan)";
        backBtn.onclick = () => {
            ui.classList.add("hidden");
            currentState = GameState.MAIN_PAGE;
        };
        controls.appendChild(backBtn);

        const freezeBtn = document.createElement("button");
        freezeBtn.innerText = "LOCK REGISTER & INITIALIZE VULN SCAN";
        freezeBtn.style.color = "var(--neon-yellow)";
        freezeBtn.style.borderColor = "var(--neon-yellow)";
        freezeBtn.style.boxShadow = "0 0 10px var(--neon-yellow)";
        freezeBtn.onclick = () => {
            showDecisionDialog("IRREVERSIBLE ACTION",
                "Locking the asset register will terminate the discovery phase. You cannot secure more equipment after this point. Proceed with Scan?",
                () => InventoryPhase.freezeAndProceed()
            );
        };

        if (player.inventory.length > 0) {
            controls.appendChild(freezeBtn);
        }

        panel.appendChild(controls);
        ui.appendChild(panel);
    },

    freezeAndProceed() {
        this.isFrozen = true;
        player.progress.inventory = true;

        const ui = document.getElementById("ui-layer");
        ui.innerHTML = `
            <div class="panel" style="justify-content:center; align-items:center; text-align:center; border-color:var(--neon-cyan); box-shadow:0 0 15px var(--neon-cyan);">
                <h2 style="color:var(--neon-cyan); text-shadow:0 0 10px var(--neon-cyan);">ASSET REGISTER LOCKED</h2>
                <p style="color:#fff; font-size:18px;">COMMENCING DEEP PACKET INSPECTION & VULNERABILITY ANALYSIS...</p>
                <div class="spinner" style="border: 6px solid rgba(0, 251, 255, 0.1); border-top: 6px solid var(--neon-cyan); border-radius: 50%; width: 60px; height: 60px; animation: spin 0.8s linear infinite; margin: 20px;"></div>
                <p style="color:var(--neon-cyan); font-family:monospace; animate: flicker 0.1s infinite;">[ ACCESSING PATCH REPOSITORY... ]</p>
            </div>
        `;

        setTimeout(() => {
            ui.classList.add("hidden");
            currentState = GameState.PATCH_MGMT;
        }, 2000);
    }
};

if (!document.getElementById("inventory-styles")) {
    const style = document.createElement("style");
    style.id = "inventory-styles";
    style.innerHTML = `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        tbody tr:hover { background: rgba(57, 255, 20, 0.05); }
    `;
    document.head.appendChild(style);
}
