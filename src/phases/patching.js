
const PatchingPhase = {
    generatedPatches: {}, // Map asset ID -> Array of patches
    patchedAssets: new Set(),

    init() {
        this.generatedPatches = {};
        this.patchedAssets.clear();

        // Generate patches for each item in inventory
        player.inventory.forEach(asset => {
            this.generatedPatches[asset.id] = this.generatePatchesForAsset(asset);
        });
    },

    generatePatchesForAsset(asset) {
        const patches = [];
        const correctIndex = Math.floor(Math.random() * 4); // One correct out of 4

        for (let i = 0; i < 4; i++) {
            const isCorrect = (i === correctIndex);

            // Randomize Data
            let risk, downtime, cvss, verification;

            if (isCorrect) {
                // Correct Criteria: Risk > 15, Verification Correct
                risk = 16 + Math.floor(Math.random() * 5); // 16-20
                verification = "OFFICIAL_VENDOR_SIG";
                downtime = Math.floor(Math.random() * 30) + 10;
                cvss = (7 + Math.random() * 3).toFixed(1);
            } else {
                // Incorrect: Either Risk is low OR Verification is bad
                if (Math.random() > 0.5) {
                    risk = Math.floor(Math.random() * 15); // 0-14
                    verification = "OFFICIAL_VENDOR_SIG";
                } else {
                    risk = Math.floor(Math.random() * 20);
                    verification = "UNSIGNED_BINARY";
                }
                downtime = Math.floor(Math.random() * 120);
                cvss = (1 + Math.random() * 9).toFixed(1);
            }

            patches.push({
                id: `KB${Math.floor(Math.random() * 1000000)}`,
                name: `${asset.name} Patch ${i + 1}`,
                risk: risk,
                downtime: downtime,
                cvss: cvss,
                verification: verification,
                isCorrect: isCorrect
            });
        }
        return patches;
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
        header.innerHTML = `<h2>PATCH MANAGEMENT SYSTEM</h2><p>Select High Risk (>15) & Verified Patches. Minimize Downtime.</p>`;
        panel.appendChild(header);

        // Content Container (Split View)
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.gap = "20px";
        container.style.height = "400px";

        // Left: Asset List
        const assetList = document.createElement("div");
        assetList.style.flex = "1";
        assetList.style.border = "1px solid #00bb00";
        assetList.style.padding = "10px";
        assetList.style.overflowY = "auto";
        assetList.innerHTML = "<h3>Pending Assets</h3>";

        // Right: Patch Details
        const patchDetails = document.createElement("div");
        patchDetails.style.flex = "2";
        patchDetails.style.border = "1px solid #00bb00";
        patchDetails.style.padding = "10px";
        patchDetails.innerHTML = "<h3>Patch Details</h3><p>Select an asset to view available patches.</p>";

        player.inventory.forEach(asset => {
            const btn = document.createElement("button");
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.innerText = `${this.patchedAssets.has(asset.id) ? "[OK]" : "[!]"} ${asset.name}`;
            if (this.patchedAssets.has(asset.id)) btn.style.color = "#555";

            btn.onclick = () => {
                if (this.patchedAssets.has(asset.id)) return;
                this.renderPatchSelection(asset, patchDetails, assetList); // Pass assetList to re-render
            };
            assetList.appendChild(btn);
        });

        container.appendChild(assetList);
        container.appendChild(patchDetails);
        panel.appendChild(container);

        // Footer: Proceed Button
        const footer = document.createElement("div");
        footer.style.textAlign = "center";
        const proceedBtn = document.createElement("button");
        proceedBtn.innerText = "PROCEED TO ACCESS CONTROL >>";
        proceedBtn.onclick = () => {
            if (this.patchedAssets.size < player.inventory.length) {
                if (!confirm("Warning: Not all assets have been patched. Proceed anyway?")) return;
            }
            currentState = GameState.ACCESS_MGMT;
            ui.classList.add("hidden");
        };
        footer.appendChild(proceedBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);
    },

    renderPatchSelection(asset, container, assetListFn) {
        container.innerHTML = `<h3>${asset.name} - Available Updates</h3>`;

        const patches = this.generatedPatches[asset.id];

        patches.forEach(patch => {
            const pDiv = document.createElement("div");
            pDiv.style.border = "1px dotted #00bb00";
            pDiv.style.marginBottom = "10px";
            pDiv.style.padding = "10px";

            pDiv.innerHTML = `
                <div style="font-weight:bold;">${patch.id}</div>
                <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr;">
                    <span>CVSS: ${patch.cvss}</span>
                    <span>Risk Score: ${patch.risk}</span>
                    <span>Downtime: ${patch.downtime}m</span>
                    <span>Sig: ${patch.verification}</span>
                </div>
            `;

            const deployBtn = document.createElement("button");
            deployBtn.innerText = "DEPLOY PATCH";
            deployBtn.onclick = () => {
                this.deployPatch(asset, patch);
                // Refresh full UI to update list
                this.render();
            };

            pDiv.appendChild(deployBtn);
            container.appendChild(pDiv);
        });
    },

    deployPatch(asset, patch) {
        if (patch.isCorrect) {
            alert(`SUCCESS: Patch ${patch.id} applied successfully from verified source. Risk mitigated.`);
            player.score += 50;
        } else {
            alert(`FAILURE: Security Incident! Patch ${patch.id} failed validation checks or low risk priority.`);
            player.score -= 20;
        }
        this.patchedAssets.add(asset.id);
    }
};
