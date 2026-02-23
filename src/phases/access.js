
const AccessPhase = {
    generatedRequests: {}, // assetId -> Array of requests
    processedAssets: new Set(),

    init() {
        this.generatedRequests = {};
        this.processedAssets.clear();

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
            const fnames = ["john", "jane", "alice", "bob", "ev", "mallory", "charlie"];
            const lnames = ["doe", "smith", "hacker", "white", "black", "admin"];
            const fn = fnames[Math.floor(Math.random() * fnames.length)];
            const ln = lnames[Math.floor(Math.random() * lnames.length)];
            const domains = ["company.com", "partner.org", "unknown.net", "hacker.site"];
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

        // HEADER
        const header = document.createElement("div");
        header.className = "panel-header";
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0;">ACCESS MANAGEMENT REVIEW</h2>
                <h2 style="margin:0; color:#bb0000;">SCORE: ${player.score}</h2>
            </div>
            <p>Review pending access requests. Approve legitimate users (Engineer/Site Manager) with valid emails. Reject violations.</p>
        `;
        panel.appendChild(header);

        // CONTENT
        const content = document.createElement("div");
        content.className = "panel-content";
        content.style.display = "flex";
        content.style.flexDirection = "row";
        content.style.padding = "0";

        // Left: Asset List
        const assetList = document.createElement("div");
        assetList.style.flex = "1";
        assetList.style.borderRight = "1px solid #00bb00";
        assetList.style.padding = "10px";
        assetList.style.overflowY = "auto";
        assetList.innerHTML = "<h3>Pending Reviews</h3>";

        // Right View
        const details = document.createElement("div");
        details.style.flex = "2";
        details.style.padding = "20px";
        details.innerHTML = "<h3>Request Queue</h3><p>Select a system to review requests.</p>";

        player.inventory.forEach(asset => {
            const reqs = this.generatedRequests[asset.id];
            const pendingCount = reqs.filter(r => !r.processed).length;

            const btn = document.createElement("button");
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.innerText = `${pendingCount === 0 ? "[DONE]" : "[PENDING]"} ${asset.name} (${pendingCount})`;
            if (pendingCount === 0) btn.style.color = "#555";

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
        const proceedBtn = document.createElement("button");
        proceedBtn.innerText = "PROCEED TO BCM / DR >>";
        proceedBtn.onclick = () => {
            // Check if all processed?
            let allDone = true;
            Object.values(this.generatedRequests).flat().forEach(r => {
                if (!r.processed) allDone = false;
            });

            if (!allDone) {
                if (!confirm("Warning: You have unprocessed requests. Unreviewed requests will be auto-rejected. Proceed?")) return;
            }
            currentState = GameState.BCM_DR;
            ui.classList.add("hidden");
        };
        footer.appendChild(proceedBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);
    },

    renderRequestList(asset, container) {
        container.innerHTML = `<h3>Requests for ${asset.name}</h3>`;

        const requests = this.generatedRequests[asset.id];

        if (requests.length === 0) {
            container.innerHTML += "<p>No pending requests.</p>";
            return;
        }

        requests.forEach(req => {
            if (req.processed) return; // Don't show processed ones? Or show them disabled.

            const card = document.createElement("div");
            card.style.border = "1px solid #00bb00";
            card.style.padding = "10px";
            card.style.marginBottom = "10px";

            card.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">User: ${req.email}</div>
                <div style="font-size: 0.9em; margin-bottom: 10px;">
                    Role: ${req.role} | Level: ${req.level}
                </div>
            `;

            const btnRow = document.createElement("div");
            btnRow.style.display = "flex";
            btnRow.style.gap = "10px";

            const approveBtn = document.createElement("button");
            approveBtn.innerText = "APPROVE";
            approveBtn.style.borderColor = "#00ff00";
            approveBtn.style.color = "#00ff00";
            approveBtn.onclick = () => this.processRequest(req, true, asset);

            const rejectBtn = document.createElement("button");
            rejectBtn.innerText = "REJECT";
            rejectBtn.style.borderColor = "#ff0000";
            rejectBtn.style.color = "#ff0000";
            rejectBtn.onclick = () => this.processRequest(req, false, asset);

            btnRow.appendChild(approveBtn);
            btnRow.appendChild(rejectBtn);
            card.appendChild(btnRow);

            container.appendChild(card);
        });

        if (requests.filter(r => !r.processed).length === 0) {
            container.innerHTML += "<p>All requests processed.</p>";
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

                // Why?
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

        alert(`${msg} (${points > 0 ? '+' : ''}${points} PTS)`);

        this.render(); // Redraw
    }
};
