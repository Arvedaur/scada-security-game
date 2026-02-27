
const PatchingPhase = {
    vulnerabilities: {
        "W_PLC": { name: "Hardcoded Admin Credentials", type: "FIRMWARE" },
        "W_SW": { name: "Unencrypted Management Traffic", type: "CONFIG" },
        "W_CMU": { name: "Outdated OS Kernel", type: "OS" },
        "B_EMS": { name: "SQL Injection in Dashboard", type: "APP" },
        "B_BMS1": { name: "BMS Protocol Vulnerability", type: "CONFIG" },
        "B_BMS2": { name: "BMS Protocol Vulnerability", type: "CONFIG" },
        "B_MET": { name: "Smart Metering Insecure Auth", type: "FIRMWARE" },
        "B_GW": { name: "Legacy TLS 1.0 Enabled", type: "CONFIG" },
        "B_FW": { name: "Buffer Overflow in Firewall OS", type: "FIRMWARE" },
        "B_VPN": { name: "Insecure Key Exchange", type: "CONFIG" },
        "S_INV_C1": { name: "Inverter API Auth Bypass", type: "CONFIG" },
        "S_INV_C2": { name: "Inverter API Auth Bypass", type: "CONFIG" },
        "S_SRV": { name: "Solar SCADA RCE", type: "APP" },
        "S_RTU": { name: "Modbus TCP Hijacking", type: "CONFIG" },
        "S_MET": { name: "Production Meter Data Leak", type: "FIRMWARE" },
        "S_SW": { name: "Default Root Password", type: "FIRMWARE" },
        "S_RAG": { name: "VPN Bypass in Gateway", type: "APP" },
        "SUB_CS": { name: "MAC Flooding Vulnerability", type: "CONFIG" },
        "SUB_FW1": { name: "OT Firewall Rule Leakage", type: "CONFIG" },
        "SUB_SRV": { name: "SCADA Core RCE", type: "OS" },
        "SUB_REL1": { name: "IED Message Modification", type: "FIRMWARE" },
        "SUB_REL2": { name: "IED Message Modification", type: "FIRMWARE" },
        "SUB_FW2": { name: "Misconfigured DMZ Proxy", type: "CONFIG" },
        "SUB_ENG": { name: "Malicious Peripheral Support", type: "OS" },
        "O_SDH1": { name: "Optical Terminal Auth Bypass", type: "FIRMWARE" },
        "O_SDH2": { name: "Optical Terminal Auth Bypass", type: "FIRMWARE" },
        "O_TERM": { name: "Physical Security Bypass", type: "CONFIG" }
    },

    assetPatches: {}, // assetId -> Array of 3 patch options
    processedAssets: new Set(),
    selectedAssetId: null,
    initialized: false,

    init() {
        this.assetPatches = {};
        this.processedAssets.clear();
        this.initialized = true;

        // Pre-generate patches for all inventory items
        player.inventory.forEach(asset => {
            this.assetPatches[asset.id] = this.generatePatchesForAsset(asset);
        });

        if (player.inventory.length > 0) {
            this.selectedAssetId = player.inventory[0].id;
        }
    },

    generatePatchesForAsset(asset) {
        const vuln = this.vulnerabilities[asset.id] || { name: "Unknown Vuln", type: "OS" };
        const patches = [];

        // Correct Patch
        patches.push({
            id: `KB${Math.floor(Math.random() * 900000) + 100000}`,
            name: "Vetted Vendor Hotfix (Official)",
            cvss: 9.8,
            official: true,
            prob: 4,
            impact: 5,
            downtime: 15,
            type: vuln.type,
            isCorrect: true
        });

        // Trap 1: High Downtime/Unofficial
        patches.push({
            id: `KB${Math.floor(Math.random() * 900000) + 100000}`,
            name: "Legacy Community Patch",
            cvss: 9.2,
            official: false,
            prob: 5,
            impact: 5,
            downtime: 45,
            type: vuln.type,
            isCorrect: false
        });

        // Trap 2: Low Risk/Low CVSS
        patches.push({
            id: `KB${Math.floor(Math.random() * 900000) + 100000}`,
            name: "Secondary Security Fix",
            cvss: 7.5,
            official: true,
            prob: 3,
            impact: 4,
            downtime: 10,
            type: vuln.type,
            isCorrect: false
        });

        return patches.sort(() => Math.random() - 0.5);
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
        panel.style.boxShadow = "0 0 30px rgba(57, 255, 20, 0.4)";

        // 1. PANEL HEADER
        const header = document.createElement("div");
        header.className = "panel-header";
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; color:var(--retro-green); text-shadow:0 0 15px var(--retro-green);">PATCH MANAGEMENT SYSTEM</h2>
                <h2 style="margin:0; color:var(--neon-red); text-shadow:0 0 10px var(--neon-red);">SCORE: ${player.score}</h2>
            </div>
            <p style="color:var(--retro-green);">Select High Risk (>15) & Verified Patches. Minimize Downtime for operational continuity.</p>
        `;
        panel.appendChild(header);

        // 2. PANEL CONTENT
        const content = document.createElement("div");
        content.className = "panel-content";
        content.style.display = "flex";
        content.style.flexDirection = "row";
        content.style.height = "calc(100% - 150px)";
        content.style.padding = "0";

        // Left Area: Asset List
        const assetList = document.createElement("div");
        assetList.style.flex = "1";
        assetList.style.borderRight = "2px solid var(--retro-green)";
        assetList.style.padding = "10px";
        assetList.style.overflowY = "auto";
        assetList.innerHTML = "<h3 style='color:var(--retro-green);'>Pending Assets</h3>";

        player.inventory.forEach(asset => {
            const isDone = this.processedAssets.has(asset.id);
            const btn = document.createElement("button");
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.borderColor = "var(--retro-green)";
            btn.style.borderWidth = "2px";
            btn.style.marginBottom = "5px";
            btn.style.color = isDone ? "#555" : "var(--retro-green)";
            if (this.selectedAssetId === asset.id) {
                btn.style.background = "rgba(0, 255, 0, 0.1)";
            }
            btn.innerText = `${isDone ? "[SECURED]" : "[!]"} ${asset.name.toUpperCase()}`;

            btn.onclick = () => {
                this.selectedAssetId = asset.id;
                this.render();
            };
            assetList.appendChild(btn);
        });
        content.appendChild(assetList);

        // Right Area: Details
        const details = document.createElement("div");
        details.style.flex = "2";
        details.style.padding = "20px";
        details.style.overflowY = "auto";
        details.innerHTML = "<h3 style='color:var(--retro-green);'>Available Updates</h3>";

        const selectedAsset = player.inventory.find(a => a.id === this.selectedAssetId);
        if (selectedAsset) {
            if (this.processedAssets.has(selectedAsset.id)) {
                details.innerHTML += `
                    <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--retro-green); border:1px dashed var(--retro-green); background:rgba(0,255,0,0.05);">
                        <div style="font-size:24px; font-weight:bold; margin-bottom:10px;">SYSTEM SECURED</div>
                        <div style="font-size:14px;">PATCH DEPLOYED SUCCESSFULLY TO ${selectedAsset.name.toUpperCase()}</div>
                    </div>
                `;
            } else {
                const patches = this.assetPatches[selectedAsset.id];
                patches.forEach(patch => {
                    const risk = patch.prob * patch.impact;
                    const card = document.createElement("div");
                    card.className = "patch-detail-card";
                    card.innerHTML = `
                        <div class="patch-card-header">
                            <div style="color:var(--retro-green); font-weight:bold; font-size:18px;">${patch.id}</div>
                        </div>
                        <div class="patch-card-body">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                <div style="color:var(--retro-green); font-size: 14px;">CVSS: <span style="color:#fff;">${patch.cvss}</span></div>
                                <div style="color:var(--retro-green); font-size: 14px;">Risk Score: <span style="color:#fff;">${risk}</span></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                <div style="color:var(--retro-green); font-size: 14px;">Downtime: <span style="color:#fff;">${patch.downtime}m</span></div>
                                <div style="color:var(--retro-green); font-size: 14px;">Sig: <span style="color:#fff;">${patch.official ? 'OFFICIAL_VENDOR_SIG' : 'UNSIGNED_COMMUNITY'}</span></div>
                            </div>
                        </div>
                    `;

                    const deployBtn = document.createElement("button");
                    deployBtn.className = "deploy-button";
                    deployBtn.innerText = "DEPLOY PATCH";
                    deployBtn.onclick = () => this.applyPatch(selectedAsset, patch);
                    card.querySelector(".patch-card-body").appendChild(deployBtn);
                    details.appendChild(card);
                });
            }
        } else {
            details.innerHTML += "<p style='color:#fff;'>Select an asset to view available security updates.</p>";
        }

        content.appendChild(details);
        panel.appendChild(content);

        // 3. PANEL FOOTER
        const footer = document.createElement("div");
        footer.className = "panel-footer";
        footer.style.marginTop = "10px";
        footer.style.textAlign = "center";

        const allDone = this.processedAssets.size === player.inventory.length;
        const proceedBtn = document.createElement("button");
        proceedBtn.innerText = "PROCEED TO ACCESS CONTROL >>";
        proceedBtn.style.color = allDone ? "var(--neon-yellow)" : "#444";
        proceedBtn.style.borderColor = allDone ? "var(--neon-yellow)" : "#444";
        proceedBtn.onclick = () => {
            if (allDone) {
                this.finishPhase();
            } else {
                showStatusMessage("ERROR: SEVERE RISK DETECTED. ALL ASSETS MUST BE PATCHED.");
            }
        };
        footer.appendChild(proceedBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);
    },

    applyPatch(asset, patch) {
        const risk = patch.prob * patch.impact;
        let success = true;
        let reasons = [];

        if (patch.cvss <= 9.0) { success = false; reasons.push("CVSS TOO LOW"); }
        if (!patch.official) { success = false; reasons.push("UNOFFICIAL SOURCE"); }
        if (risk <= 15) { success = false; reasons.push("LOW RISK PRIORITY"); }
        if (patch.downtime >= 30) { success = false; reasons.push("EXCESSIVE DOWNTIME"); }

        let points = success ? 50 : -25;
        let msg = success ? `SUCCESS! Patch ${patch.id} applied to ${asset.name}.` : `FAILED! Deployment violation: ${reasons.join(", ")}.`;

        player.score += points;
        player.phaseScores.patching += points;
        this.processedAssets.add(asset.id);

        showStatusMessage(`${msg} (${points > 0 ? '+' : ''}${points} PTS)`);
        this.render();
    },

    finishPhase() {
        player.progress.patching = true;
        showStatusMessage("ALL ASSETS PROCESSED. MOVING TO ACCESS CONTROL...", 4000);
        setTimeout(() => {
            currentState = GameState.ACCESS_MGMT;
            document.getElementById("ui-layer").classList.add("hidden");
        }, 1000);
    }
};
