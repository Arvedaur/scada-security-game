
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

        const header = document.createElement("div");
        header.className = "panel-header";
        const titleRow = document.createElement("div");
        titleRow.style.display = "flex";
        titleRow.style.justifyContent = "space-between";
        titleRow.innerHTML = `
            <h2 style="margin:0;">ASSET INVENTORY VERIFICATION</h2>
            <h2 style="margin:0; color: #bb0000;">SCORE: ${player.score}</h2>
        `;
        header.appendChild(titleRow);
        panel.appendChild(header);

        if (player.inventory.length === 0) {
            const msg = document.createElement("p");
            msg.innerText = "WARNING: No assets collected. System vulnerability assessment cannot proceed.";
            msg.style.color = "red";
            panel.appendChild(msg);
        } else {
            const list = document.createElement("ul");
            list.style.listStyle = "none";
            list.style.padding = "0";

            player.inventory.forEach(item => {
                const li = document.createElement("li");
                li.style.borderBottom = "1px solid #333";
                li.style.padding = "5px";
                li.innerText = `[SECURED] ${item.name} (${item.id})`;
                list.appendChild(li);
            });
            panel.appendChild(list);
        }

        const controls = document.createElement("div");
        controls.style.marginTop = "20px";
        controls.style.textAlign = "center";

        const backBtn = document.createElement("button");
        backBtn.innerText = "RETURN TO FIELD";
        backBtn.onclick = () => {
            ui.classList.add("hidden");
            currentState = GameState.MAIN_PAGE;
        };
        controls.appendChild(backBtn);

        const freezeBtn = document.createElement("button");
        freezeBtn.innerText = "CONFIRM & FREEZE ASSETS";
        freezeBtn.onclick = () => {
            if (confirm("WARNING: Freezing the asset inventory is irreversible. You will not be able to collect more assets. Proceed?")) {
                InventoryPhase.freezeAndProceed();
            }
        };

        if (player.inventory.length > 0) {
            controls.appendChild(freezeBtn);
        }

        panel.appendChild(controls);
        ui.appendChild(panel);
    },

    freezeAndProceed() {
        this.isFrozen = true;
        player.progress.inventory = true; // Mark as done

        // Transition to next phase
        alert("ASSET INVENTORY LOCKED. INITIALIZING PATCH MANAGEMENT PROTOCOLS...");

        // Hide UI
        const ui = document.getElementById("ui-layer");
        ui.classList.add("hidden");

        // Change State
        currentState = GameState.PATCH_MGMT;
        // We might want to trigger the UI for Patch Mgmt immediately, but main loop will handle rendering
    }
};
