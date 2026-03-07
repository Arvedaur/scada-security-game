
const IDSPhase = {
    packets: [],
    lastPacketTime: 0,
    packetInterval: 1000,
    startTime: 0,
    duration: 30000,
    active: false,
    flowActive: true,
    timerInterval: null,
    showReport: false,
    reportRendered: false,

    stats: {
        blocked: 0,
        missed: 0,
        falsePos: 0,
        normalProcessed: 0,
        totalMalicious: 0
    },

    trafficTypes: [
        { name: "Modbus TCP", color: "#39ff14", risk: "low" },
        { name: "IEC 60870-104", color: "#39ff14", risk: "low" },
        { name: "DNP3", color: "#39ff14", risk: "low" },
        { name: "SSH Admin Access", color: "#ffae00", risk: "med" },
        { name: "Unrecognized Port", color: "#ffae00", risk: "med" },
        { name: "MALICIOUS: Buffer Overflow", color: "#ff2d44", risk: "high" },
        { name: "MALICIOUS: SQL Injection", color: "#ff2d44", risk: "high" },
        { name: "MALICIOUS: Bruteforce", color: "#ff2d44", risk: "high" },
        { name: "MALICIOUS: Command Injection", color: "#ff2d44", risk: "high" }
    ],

    init() {
        this.packets = [];
        this.startTime = Date.now();
        this.active = true;
        this.flowActive = true;
        this.showReport = false;
        this.reportRendered = false;
        this.stats = { blocked: 0, missed: 0, falsePos: 0, normalProcessed: 0, totalMalicious: 0 };

        const ui = document.getElementById("ui-layer");
        ui.innerHTML = ""; // Initial clear

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.active) {
                this.update();
                this.render();
            }
        }, 30);
    },

    spawnPacket() {
        const typeObj = this.trafficTypes[Math.floor(Math.random() * this.trafficTypes.length)];
        let finalType = typeObj;
        if (Math.random() > 0.75) {
            const malicious = this.trafficTypes.filter(t => t.risk === "high");
            finalType = malicious[Math.floor(Math.random() * malicious.length)];
            this.stats.totalMalicious++;
        }

        const id = "PKT-" + Math.floor(Math.random() * 10000);
        this.packets.push({
            id,
            timestamp: new Date().toLocaleTimeString().split(' ')[0],
            source: `10.10.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 254)}`,
            dest: `10.1.1.${Math.floor(Math.random() * 254)}`,
            type: finalType.name,
            color: finalType.color,
            risk: finalType.risk,
            processed: false,
            y: -100
        });
    },

    update() {
        if (!this.flowActive) return;

        const now = Date.now();
        const elapsed = now - this.startTime;

        if (elapsed < this.duration) {
            const latestPacket = this.packets[this.packets.length - 1];
            // 55px gap requested. Card is 75px. 75+55 = 130px.
            const safeDistance = !latestPacket || latestPacket.y > 130;

            if (safeDistance && now - this.lastPacketTime > this.packetInterval) {
                this.spawnPacket();
                this.lastPacketTime = now;
            }
        }

        const speed = 1.3;
        this.packets.forEach(p => {
            p.y += speed;
        });

        this.packets.forEach(p => {
            if (p.y > 650 && !p.processed) {
                if (p.risk === "high") {
                    player.score -= 50;
                    player.phaseScores.ids -= 50;
                    this.stats.missed++;
                    showStatusMessage("!!! CRITICAL SECURITY BREACH !!!", 1500);
                    player.incidents.push(`Missed Attack: ${p.type} from ${p.source}`);
                }
                p.processed = true;
            }
        });

        if (elapsed > this.duration + 4000) {
            this.flowActive = false;
        }
    },

    processPacket(packetId) {
        const packet = this.packets.find(p => p.id === packetId);
        if (!packet || packet.processed) return;

        packet.processed = true;

        if (packet.risk === "high") {
            player.score += 100; // Increased reward
            player.phaseScores.ids += 100;
            this.stats.blocked++;
            showStatusMessage("THREAT NEUTRALIZED", 1000);
        } else if (packet.risk === "low") {
            player.score -= 40;
            player.phaseScores.ids -= 40;
            this.stats.falsePos++;
            showStatusMessage("ERR: Blocked Legitimate Traffic", 1200);
        } else {
            player.score += 25;
            this.stats.normalProcessed++;
            showStatusMessage("Suspicious Activity Logged", 1000);
        }

        // Immediate visual update for the element to fix button responsiveness
        const el = document.getElementById(packet.id);
        if (el) {
            el.style.background = "rgba(40,40,40,0.5)";
            el.style.borderColor = "#555";
            el.style.color = "#777";
            const btnArea = el.querySelector(".pkt-action");
            if (btnArea) btnArea.innerHTML = '<span style="font-size:18px; color:#888; font-style: italic;">[ PROCESSED ]</span>';
        }
    },

    render() {
        const ui = document.getElementById("ui-layer");
        ui.classList.remove("hidden");

        if (this.showReport) {
            if (!this.reportRendered) {
                ui.innerHTML = "";
                this.renderReport(ui);
                this.reportRendered = true;
            }
            return;
        }

        // Initialize frame if not exists
        if (!document.getElementById("ids-main-frame")) {
            ui.innerHTML = `
                <div id="ids-main-frame" class="panel" style="display:flex; flex-direction:column; height:85%; width:92%; max-width:1800px; padding: 25px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom: 3px solid var(--retro-green); padding-bottom:15px;">
                        <div>
                            <h2 style="margin:0; color:var(--retro-green); font-size: 34px; text-shadow:0 0 15px var(--retro-green);">NETWORK INTRUSION MONITOR</h2>
                            <p style="color:#aaa; margin:5px 0 0 0; font-size: 18px;">[VIGILANCE REQUIRED]: Intercept <span style="color:#ff2d44; font-weight:bold;">RED</span> alerts. Permit <span style="color:#39ff14; font-weight:bold;">GREEN</span> logs.</p>
                        </div>
                        <div style="text-align:right; min-width: 400px;">
                            <div id="ids-timer-text" style="color:var(--neon-yellow); font-size:38px; font-weight:bold; letter-spacing: 2px;">SESSION ACTIVE</div>
                            <div id="ids-score-text" style="color:white; font-size:24px;">TOTAL SCORE: 0</div>
                        </div>
                    </div>
                    <div id="ids-view-port" style="position:relative; flex:1; background:#020508; border:3px solid #222; overflow:hidden; box-shadow:inset 0 0 100px rgba(0,0,0,0.9); border-radius: 4px;">
                        <div id="ids-grid" style="position:absolute; inset:0; background-image: linear-gradient(rgba(57,255,20,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.03) 1px, transparent 1px); background-size: 100px 100px;"></div>
                    </div>
                    <div id="ids-footer-area" style="text-align:right; margin-top:20px; height: 60px; display: flex; align-items: center; justify-content: flex-end;">
                        <span id="ids-status-msg" style="color:#666; font-style:italic; font-size: 20px;">SYSTEM STATUS: ACTIVE MONITORING ...</span>
                    </div>
                </div>
            `;
        }

        const viewport = document.getElementById("ids-view-port");
        const timerText = document.getElementById("ids-timer-text");
        const scoreText = document.getElementById("ids-score-text");
        const footerArea = document.getElementById("ids-footer-area");

        const timeLeft = Math.max(0, Math.ceil((this.duration - (Date.now() - this.startTime)) / 1000));
        timerText.innerText = timeLeft > 0 ? `SESSION ACTIVE: ${timeLeft}s` : "SESSION COMPLETE";
        scoreText.innerText = `TOTAL SCORE: ${player.score}`;

        if (timeLeft === 0 && !this.flowActive && !document.getElementById("ids-finish-btn")) {
            footerArea.innerHTML = `
                <button id="ids-finish-btn" style="font-size:26px; padding:15px 50px; color:var(--retro-green); border-color:var(--retro-green); cursor:pointer; background:rgba(0,0,0,0.5);" onclick="IDSPhase.showReport = true; IDSPhase.render();">
                    GENERATE SYSTEM PERFORMANCE REPORT >>
                </button>
            `;
        }

        this.packets.forEach(p => {
            let pEl = document.getElementById(p.id);
            if (!pEl) {
                pEl = document.createElement("div");
                pEl.id = p.id;
                pEl.style.position = "absolute";
                pEl.style.left = "40px";
                pEl.style.right = "40px";
                pEl.style.height = "75px";
                pEl.style.background = "rgba(10,20,40,0.95)";
                pEl.style.border = `2px solid ${p.color}`;
                pEl.style.borderRadius = "4px";
                pEl.style.display = "flex";
                pEl.style.alignItems = "center";
                pEl.style.padding = "0 30px";
                pEl.style.color = p.color;
                pEl.style.boxShadow = `0 0 15px ${p.color}33`;
                pEl.style.zIndex = "100";
                pEl.style.transition = "background 0.2s, border-color 0.2s";

                pEl.innerHTML = `
                    <div style="font-family:'Courier New', monospace; min-width: 24rem; font-size: 19px; line-height: 1.2;">
                        <span style="color:#888;">[${p.timestamp}]</span><br>
                        <span style="font-weight:bold;">SRC: ${p.source}</span><br>
                        <span style="font-weight:bold;">DST: ${p.dest}</span>
                    </div>
                    <div style="flex:1; text-align:center; font-size: 26px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">
                        ${p.type}
                    </div>
                    <div class="pkt-action" style="min-width: 14rem; text-align: right;">
                        <button style="padding:12px 35px; font-size:22px; font-weight: 900; background:rgba(0,0,0,0.8); border:3px solid ${p.color}; color:${p.color}; cursor:pointer; text-transform:uppercase;" onclick="IDSPhase.processPacket('${p.id}')">BLOCK</button>
                    </div>
                `;
                viewport.appendChild(pEl);
            }

            // Update position
            pEl.style.top = p.y + "px";

            // Visual effects for high risk
            if (!p.processed && p.risk === "high") {
                pEl.style.boxShadow = `0 0 35px ${p.color}`;
                if (Date.now() % 400 < 200) {
                    pEl.style.borderColor = "#fff";
                    pEl.style.background = "rgba(100,0,0,0.4)";
                } else {
                    pEl.style.borderColor = p.color;
                    pEl.style.background = "rgba(15,30,50,0.95)";
                }
            } else if (p.processed) {
                pEl.style.background = "rgba(40,40,40,0.5)";
                pEl.style.borderColor = "#555";
                pEl.style.color = "#777";
                pEl.style.boxShadow = "none";
            }
        });
    },

    renderReport(ui) {
        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.width = "750px";
        panel.style.padding = "40px";
        panel.style.textAlign = "center";
        panel.style.borderColor = "var(--neon-yellow)";
        panel.style.boxShadow = "0 0 50px var(--neon-yellow)";

        const totalMaliciousActual = this.stats.blocked + this.stats.missed;
        const effectiveness = totalMaliciousActual === 0 ? 100 : Math.round((this.stats.blocked / totalMaliciousActual) * 100);

        let grade = "F";
        let color = "#ff2d44";
        if (effectiveness >= 95) { grade = "A+"; color = "#39ff14"; }
        else if (effectiveness >= 85) { grade = "A"; color = "#39ff14"; }
        else if (effectiveness >= 75) { grade = "B"; color = "#39ff14"; }
        else if (effectiveness >= 60) { grade = "C"; color = "#ffae00"; }
        else if (effectiveness >= 40) { grade = "D"; color = "#ffae00"; }

        panel.innerHTML = `
            <h1 style="color:var(--neon-yellow); margin-top:0; font-size: 42px; letter-spacing: 5px;">IDS PERFORMANCE AUDIT</h1>
            <div style="color: #666; margin-bottom: 30px; font-size: 18px;">REPORT HASH: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            <hr style="border-color:rgba(255,255,0,0.3); margin:30px 0;">
            
            <div style="display:grid; grid-template-columns: 1fr 100px; gap: 20px; text-align: left; margin: 0 auto 40px; font-size: 24px; max-width: 600px;">
                <div style="color:#aaa;">Critical Threats Detected:</div><div style="color:white; font-weight:bold; text-align: right;">${totalMaliciousActual}</div>
                <div style="color:#39ff14;">Threats Intercepted:</div><div style="color:#39ff14; font-weight:bold; text-align: right;">${this.stats.blocked}</div>
                <div style="color:#ff2d44;">Network Penetrations:</div><div style="color:#ff2d44; font-weight:bold; text-align: right;">${this.stats.missed}</div>
                <div style="color:#ffae00;">Operational Errors:</div><div style="color:#ffae00; font-weight:bold; text-align: right;">${this.stats.falsePos}</div>
            </div>

            <div style="background: rgba(0,0,0,0.7); padding: 40px; border-radius: 12px; border: 2px solid #444; margin-bottom: 40px;">
                <div style="font-size: 22px; color: #888; margin-bottom: 10px; letter-spacing: 3px;">SECURITY CLEARANCE GRADE</div>
                <div style="font-size: 120px; font-weight: bold; color: ${color}; text-shadow: 0 0 40px ${color}">
                    ${grade}
                </div>
                <div style="font-size: 26px; color: #fff; margin-top: 15px;">${effectiveness}% Network Integrity</div>
            </div>

            <button style="font-size:30px; padding:20px 70px; border-color:var(--retro-green); color:var(--retro-green); cursor: pointer; font-weight: bold;" onclick="IDSPhase.finish()">PROCEED TO COMMAND CENTER >></button>
        `;
        ui.appendChild(panel);
    },

    finish() {
        this.stop();
        player.progress.ids = true;
        window.currentState = GameState.BCM_DR;
        if (typeof BCMPhase !== 'undefined') {
            if (!BCMPhase.initialized) { BCMPhase.init(); BCMPhase.initialized = true; }
            BCMPhase.render();
        }
        document.getElementById("ui-layer").classList.add("hidden");
    },

    stop() {
        this.active = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.reportRendered = false;
    }
};

window.IDSPhase = IDSPhase;
