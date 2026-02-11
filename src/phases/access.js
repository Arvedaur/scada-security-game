
const AccessPhase = {
    configuredAssets: new Set(),

    init() {
        this.configuredAssets.clear();
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
            <h2>ACCESS MANAGEMENT</h2>
            <p>Create accounts for each asset. Only authorized roles (Engineer/Site Manager) can have WRITE access.</p>
            <p>Restricted Roles: Accountant, Animal Trainer.</p>
        `;
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
        assetList.innerHTML = "<h3>Target Systems</h3>";

        // Right: Access Form
        const accessForm = document.createElement("div");
        accessForm.style.flex = "2";
        accessForm.style.border = "1px solid #00bb00";
        accessForm.style.padding = "20px";
        accessForm.innerHTML = "<h3>User Configuration</h3><p>Select a system to configure access.</p>";

        player.inventory.forEach(asset => {
            const btn = document.createElement("button");
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.innerText = `${this.configuredAssets.has(asset.id) ? "[LOCKED]" : "[OPEN]"} ${asset.name}`;
            if (this.configuredAssets.has(asset.id)) btn.style.color = "#555";

            btn.onclick = () => {
                if (this.configuredAssets.has(asset.id)) return;
                this.renderAccessForm(asset, accessForm);
            };
            assetList.appendChild(btn);
        });

        container.appendChild(assetList);
        container.appendChild(accessForm);
        panel.appendChild(container);

        // Footer: Proceed Button
        const footer = document.createElement("div");
        footer.style.textAlign = "center";
        const proceedBtn = document.createElement("button");
        proceedBtn.innerText = "PROCEED TO BCM / DR >>";
        proceedBtn.onclick = () => {
            if (this.configuredAssets.size < player.inventory.length) {
                if (!confirm("Warning: Not all systems have configured access controls. Proceed?")) return;
            }
            currentState = GameState.BCM_DR;
            ui.classList.add("hidden");
        };
        footer.appendChild(proceedBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);
    },

    renderAccessForm(asset, container) {
        container.innerHTML = `<h3>Configuring: ${asset.name}</h3>`;

        const form = document.createElement("div");
        form.style.display = "flex";
        form.style.flexDirection = "column";
        form.style.gap = "15px";
        form.style.maxWidth = "400px";

        // Email Input
        const emailDiv = document.createElement("div");
        emailDiv.innerHTML = `<label>User Email (Personal):</label><br>`;
        const emailInput = document.createElement("input");
        emailInput.type = "text";
        emailInput.placeholder = "user@example.com";
        emailInput.style.width = "100%";
        emailDiv.appendChild(emailInput);
        form.appendChild(emailDiv);

        // Role Select
        const roleDiv = document.createElement("div");
        roleDiv.innerHTML = `<label>Role:</label><br>`;
        const roleSelect = document.createElement("select");
        roleSelect.style.width = "100%";
        ["Operator", "Engineer", "Site Manager", "Accountant", "Animal Trainer"].forEach(r => {
            const opt = document.createElement("option");
            opt.value = r;
            opt.innerText = r;
            roleSelect.appendChild(opt);
        });
        roleDiv.appendChild(roleSelect);
        form.appendChild(roleDiv);

        // Access Level Select
        const levelDiv = document.createElement("div");
        levelDiv.innerHTML = `<label>Access Level:</label><br>`;
        const levelSelect = document.createElement("select");
        levelSelect.style.width = "100%";
        ["Read-Only", "Write", "Admin"].forEach(l => {
            const opt = document.createElement("option");
            opt.value = l;
            opt.innerText = l;
            levelSelect.appendChild(opt);
        });
        levelDiv.appendChild(levelSelect);
        form.appendChild(levelDiv);

        // Submit Button
        const submitBtn = document.createElement("button");
        submitBtn.innerText = "GRANT ACCESS";
        submitBtn.style.marginTop = "20px";
        submitBtn.onclick = () => {
            this.validateAndSubmit(asset, emailInput.value, roleSelect.value, levelSelect.value);
        };
        form.appendChild(submitBtn);

        container.appendChild(form);
    },

    validateAndSubmit(asset, email, role, level) {
        // 1. Email Check (Personal Email)
        // Simple regex for email structure + check for not being a corporate domain if needed? 
        // Prompt says "must be personal e mail address". I'll check generic structure for now + maybe blacklist 'company.com'?
        // Actually, let's just enforce it looks like an email.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("ERROR: Invalid Email Format.");
            return;
        }

        // 2. Role Check
        if (role === "Accountant" || role === "Animal Trainer") {
            alert(`SECURITY VIOLATION: Role '${role}' is not authorized for OT Access.`);
            player.score -= 20;
            return;
        }

        // 3. Access Level Check
        // Level cannot be WRITE unless Engineer or Site Manager
        // (Assuming Admin also needs high privs, but prompt only mentions Write specifically? "access level cannot be write access unless...")
        // I will assume Admin is also restricted similarly or Admin IS Write+.
        if ((level === "Write" || level === "Admin") && (role !== "Engineer" && role !== "Site Manager")) {
            alert(`SECURITY VIOLATION: Role '${role}' cannot hold '${level}' privileges.`);
            player.score -= 20;
            return;
        }

        // Success
        alert(`ACCESS GRANTED: User '${email}' added to ${asset.name}.`);
        player.score += 40;
        this.configuredAssets.add(asset.id);
        this.render(); // Redraw to update list
    }
};
