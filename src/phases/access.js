
const AccessPhase = {
    generatedRequests: {}, // assetId -> Array of requests
    processedAssets: new Set(),
    initialized: false,

    init() {
        this.generatedRequests = {};
        this.processedAssets.clear();
        this.initialized = true;

        // Generate mock requests for each asset
        player.inventory.forEach(asset => {
            this.generatedRequests[asset.id] = this.generateRequestsForAsset(asset);
        });
    },

    generateRequestsForAsset(asset) {
        // Generate 1-3 requests pending for this asset
        const requests = [];
        const count = Math.floor(Math.random() * 3) + 1;

        const roles = ["Operator", "Engineer", "Site Manager", "Accountant", "Animal Trainer"];
        const levels = ["Read-Only", "Write", "Admin"];

        for (let i = 0; i < count; i++) {
            // Randomize
            const role = roles[Math.floor(Math.random() * roles.length)];
            const level = levels[Math.floor(Math.random() * levels.length)];

            // Generate Name + Email
            const fnames = ["john", "jane", "alice", "bob", "sarah", "mike", "joe", "dave"];
            const lnames = ["doe", "smith", "white", "black", "wilson", "brown"];
            const fn = fnames[Math.floor(Math.random() * fnames.length)];
            const ln = lnames[Math.floor(Math.random() * lnames.length)];
            const domains = ["company.com", "partner.org", "internal-grid.net", "service-contractor.com"];
            const domain = domains[Math.floor(Math.random() * domains.length)];

            // Format check (sometimes invalid format)
            let email = `${fn}.${ln}@${domain}`;
            if (Math.random() > 0.9) email = `${fn}_${ln}123`; // Bad format

            // Determine if Valid Request
            let isValid = true;
            let violationReason = "";

            // 1. Email Format
            if (!/^[a-zA-Z]+\.[a-zA-Z]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                violationReason = "Invalid Email Format";
            }
            // 2. Bad Domain (optional logic, simplifed here to just format/role)

            // 3. Bad Role
            if (role === "Accountant" || role === "Animal Trainer") {
                isValid = false;
                violationReason += " Unauthorized Role";
            }

            // 4. Bad Access Level
            if ((level === "Write" || level === "Admin") && (role !== "Engineer" && role !== "Site Manager")) {
                isValid = false;
                violationReason += " Excessive Privileges";
            }

            requests.push({
                id: `REQ-${Math.floor(Math.random() * 1000)}`,
                email: email,
                role: role,
                level: level,
                isValid: isValid,
                violationReason: violationReason.trim(),
                processed: false
            });
        }
        return requests;
    },

    render() {
        const ui = document.getElementById("ui-layer");
        ui.innerHTML = "";
        ui.classList.remove("hidden");

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.borderColor = "var(--retro-green)";
        panel.style.borderWidth = "4px";
        panel.style.boxShadow = "0 0 20px var(--retro-green)";

        // HEADER
        const header = document.createElement("div");
        header.className = "panel-header";
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; color:var(--retro-green); text-shadow:0 0 15px var(--retro-green);">ACCESS MANAGEMENT REVIEW</h2>
                <div style="display:flex; align-items:center; gap:20px;">
                    <h2 style="margin:0; color:white; text-shadow:0 0 5px var(--retro-green);">SCORE: ${player.score}</h2>
                    <div id="access-help-btn" style="width:30px; height:30px; border:2px solid var(--retro-green); color:var(--retro-green); display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size:20px;">?</div>
                </div>
            </div>
            <p style="color:var(--retro-green);">Review pending access requests. Approve legitimate users (Engineer/Site Manager) with valid emails. Reject violations.</p>
        `;
        panel.appendChild(header);

        // Add help click handler
        setTimeout(() => {
            const btn = document.getElementById("access-help-btn");
            if (btn) btn.onclick = () => HelpSystem.showHelp();
        }, 0);

        // CONTENT
        const content = document.createElement("div");
        content.className = "panel-content";
        content.style.display = "flex";
        content.style.flexDirection = "row";
        content.style.padding = "0";
        content.style.height = "calc(100% - 150px)";

        // Left: Asset List
        const assetList = document.createElement("div");
        assetList.style.flex = "1";
        assetList.style.borderRight = "2px solid var(--retro-green)";
        assetList.style.padding = "10px";
        assetList.style.overflowY = "auto";
        assetList.innerHTML = "<h3 style='color:var(--retro-green);'>Pending Reviews</h3>";

        // Right View
        const details = document.createElement("div");
        details.style.flex = "2";
        details.style.padding = "20px";
        details.style.overflowY = "auto";
        details.innerHTML = "<h3 style='color:var(--retro-green);'>Request Queue</h3><p style='color:#fff;'>Select a system to review requests.</p>";

        player.inventory.forEach(asset => {
            const reqs = this.generatedRequests[asset.id];
            const pendingCount = reqs.filter(r => !r.processed).length;

            const btn = document.createElement("button");
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.borderColor = "var(--retro-green)";
            btn.style.borderWidth = "2px";
            btn.style.fontSize = "18px";
            btn.style.color = pendingCount === 0 ? "#555" : "var(--retro-green)";
            btn.innerText = `${pendingCount === 0 ? "[DONE]" : "[PENDING]"} ${asset.name} (${pendingCount})`;

            btn.onclick = () => {
                this.renderRequestList(asset, details);
            };
            assetList.appendChild(btn);
        });

        content.appendChild(assetList);
        content.appendChild(details);
        panel.appendChild(content);

        // FOOTER
        const footer = document.createElement("div");
        footer.className = "panel-footer";
        footer.style.marginTop = "10px";
        const handleProceed = (nextState, initFunc) => {
            let allDone = true;
            Object.values(this.generatedRequests).flat().forEach(r => {
                if (!r.processed) allDone = false;
            });

            const finalize = () => {
                player.progress.access = true;
                window.currentState = nextState;
                if (initFunc) initFunc();
                document.getElementById("ui-layer").classList.add("hidden");
            };

            if (!allDone) {
                showDecisionDialog("UNPROCESSED REQUESTS",
                    "You have unprocessed requests. Unreviewed requests will be auto-rejected. Proceed?",
                    finalize
                );
            } else {
                finalize();
            }
        };

        const proceedIDSBtn = document.createElement("button");
        proceedIDSBtn.innerText = "PROCEED TO IDS MONITOR >>";
        proceedIDSBtn.style.color = "var(--neon-yellow)";
        proceedIDSBtn.style.borderColor = "var(--neon-yellow)";
        proceedIDSBtn.style.marginRight = "10px";
        proceedIDSBtn.onclick = () => handleProceed(GameState.IDS_MONITOR, () => IDSPhase.init());

        const proceedBCMBtn = document.createElement("button");
        proceedBCMBtn.innerText = "PROCEED TO BCM / DR >>";
        proceedBCMBtn.style.color = "#39ff14";
        proceedBCMBtn.style.borderColor = "#39ff14";
        proceedBCMBtn.onclick = () => handleProceed(GameState.BCM_DR, () => {
            if (typeof BCMPhase !== 'undefined') {
                if (!BCMPhase.initialized) { BCMPhase.init(); BCMPhase.initialized = true; }
                BCMPhase.render();
            }
        });

        footer.appendChild(proceedIDSBtn);
        footer.appendChild(proceedBCMBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);
    },

    renderRequestList(asset, container) {
        container.innerHTML = `<h3 style='color:var(--neon-green); font-size: 1.3em;'>Requests for ${asset.name}</h3>`;

        const requests = this.generatedRequests[asset.id];

        if (requests.length === 0) {
            container.innerHTML += "<p style='color:#fff;'>No pending requests.</p>";
            return;
        }

        requests.forEach(req => {
            if (req.processed) return;

            const card = document.createElement("div");
            card.style.border = "1px solid var(--neon-cyan)";
            card.style.padding = "15px";
            card.style.marginBottom = "15px";
            card.style.background = "rgba(0, 251, 255, 0.05)";

            card.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px; color:var(--neon-green); font-size: 20px;">User: ${req.email}</div>
                <div style="font-size: 1.1em; margin-bottom: 10px; color:#fff;">
                    Role: ${req.role} | Level: ${req.level}
                </div>
            `;

            const btnRow = document.createElement("div");
            btnRow.style.display = "flex";
            btnRow.style.gap = "10px";

            const approveBtn = document.createElement("button");
            approveBtn.innerText = "APPROVE";
            approveBtn.style.borderColor = "var(--neon-green)";
            approveBtn.style.color = "var(--neon-green)";
            approveBtn.onclick = () => this.processRequest(req, true, asset);

            const rejectBtn = document.createElement("button");
            rejectBtn.innerText = "REJECT";
            rejectBtn.style.borderColor = "var(--neon-red)";
            rejectBtn.style.color = "var(--neon-red)";
            rejectBtn.onclick = () => this.processRequest(req, false, asset);

            btnRow.appendChild(approveBtn);
            btnRow.appendChild(rejectBtn);
            card.appendChild(btnRow);

            container.appendChild(card);
        });

        if (requests.filter(r => !r.processed).length === 0) {
            container.innerHTML += "<p style='color:var(--neon-green);'>All requests processed.</p>";
        }
    },

    processRequest(req, approved, asset) {
        req.processed = true;

        let points = 0;
        let msg = "";
        let incidentValue = "";

        if (approved) {
            if (req.isValid) {
                points = 20;
                msg = "APPROVED: Access Granted to Valid User.";
            } else {
                points = -20;
                msg = `VIOLATION: Granted Access to Invalid Request.`;
                incidentValue = `Granted Unauthorized Access to ${req.email}`;

                msg += `\n\nWHY IT MATTERS: ${req.violationReason}`;
                if (req.violationReason.includes("Excessive Privileges")) {
                    msg += "\n\nPRINCIPLE OF LEAST PRIVILEGE: Users should only have the bare minimum access rights needed for their job.";
                }
            }
        } else {
            // Rejected
            if (req.isValid) {
                points = -10;
                msg = "WARNING: Rejected Valid User request.";
                incidentValue = `Rejected Valid User ${req.email}`;
                msg += "\n\nWHY IT MATTERS: Blocking legitimate engineers disrupts operations (Availability impact).";
            } else {
                points = 20;
                msg = "BLOCKED: Successfully prevented unauthorized access.";
            }
        }

        player.score += points;
        player.phaseScores.access += points;

        if (incidentValue) player.incidents.push(incidentValue);

        showStatusMessage(`${msg} (${points > 0 ? '+' : ''}${points} PTS)`, 4000);

        this.render(); // Redraw
    }
};
