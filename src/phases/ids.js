
const IDSPhase = {
    packets: [],
    lastPacketTime: 0,
    packetInterval: 1000,
    startTime: 0,
    duration: 60000,
    active: false,
    flowActive: true,
    timerInterval: null,
    showReport: false,
    reportRendered: false,

    trustedDestinations: [
        { ip: "52.148.15.22", name: "Windows Update MS" },
        { ip: "91.189.91.38", name: "Ubuntu Repo Cluster" },
        { ip: "13.107.4.52", name: "Edge Security Gateway" },
        { ip: "10.1.1.5", name: "Internal Update Server" },
        { ip: "20.190.159.0", name: "Defender Cloud" }
    ],

    stats: {
        blocked: 0,
        missed: 0,
        falsePos: 0,
        normalProcessed: 0,
        totalMalicious: 0,
        correctDecisions: 0,
        wrongDecisions: 0
    },

    trafficTypes: [
        { name: "Modbus TCP", color: "#39ff14", risk: "low" },
        { name: "IEC 60870-104", color: "#39ff14", risk: "low" },
        { name: "DNP3", color: "#39ff14", risk: "low" },
        { name: "HTTPS: Software Update", color: "#ffae00", risk: "med" },
        { name: "SSH: Remote Admin", color: "#ffae00", risk: "med" },
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
        this.stats = { blocked: 0, missed: 0, falsePos: 0, normalProcessed: 0, totalMalicious: 0, correctDecisions: 0, wrongDecisions: 0 };

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
        const roll = Math.random();
        let finalType;

        if (roll > 0.70) {
            const malicious = this.trafficTypes.filter(t => t.risk === "high");
            finalType = malicious[Math.floor(Math.random() * malicious.length)];
            this.stats.totalMalicious++;
        } else if (roll > 0.40) {
            const suspicious = this.trafficTypes.filter(t => t.risk === "med");
            finalType = suspicious[Math.floor(Math.random() * suspicious.length)];
        } else {
            const normal = this.trafficTypes.filter(t => t.risk === "low");
            finalType = normal[Math.floor(Math.random() * normal.length)];
        }

        let destIp = `10.1.1.${Math.floor(Math.random() * 254)}`;
        let destLabel = "INTERNAL SERVICE";
        let isTrusted = false;

        // If medium risk, decide if it's trusted or spoofed
        if (finalType.risk === "med") {
            if (Math.random() > 0.5) {
                const trusted = this.trustedDestinations[Math.floor(Math.random() * this.trustedDestinations.length)];
                destIp = trusted.ip;
                destLabel = trusted.name;
                isTrusted = true;
            } else {
                destIp = `${Math.floor(Math.random() * 200) + 10}.${Math.random() > 0.5 ? "25" : "80"}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                destLabel = "EXTERNAL: UNKNOWN";
                isTrusted = false;
            }
        }

        const id = "PKT-" + Math.floor(Math.random() * 10000);
        this.packets.push({
            id,
            timestamp: new Date().toLocaleTimeString().split(' ')[0],
            source: `10.10.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 254)}`,
            dest: destIp,
            destLabel: destLabel,
            isTrusted: isTrusted,
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
                    showStatusMessage("!!! FAIL: ATTACK PENETRATED !!! (-50 PTS)", 1500);
                    player.incidents.push(`Missed Attack: ${p.type} from ${p.source}`);
                } else if (p.risk === "med") {
                    // Medium ignored is a small penalty if it was malicious (not trusted)
                    if (!p.isTrusted) {
                        player.score -= 20;
                        this.stats.wrongDecisions++;
                        showStatusMessage("WARN: Unapproved Connection Established (-20 PTS)", 1200);
                    }
                }
                p.processed = true;
            }
        });

        if (elapsed > this.duration + 4000) {
            this.flowActive = false;
        }
    },

    processPacket(packetId, actionType = 'block') {
        const packet = this.packets.find(p => p.id === packetId);
        if (!packet || packet.processed) return;

        packet.processed = true;

        if (packet.risk === "high") {
            player.score += 100; // Increased reward
            player.phaseScores.ids += 100;
            this.stats.blocked++;
            showStatusMessage("THREAT NEUTRALIZED (+100 PTS)", 1000);
        } else if (packet.risk === "med") {
            if (actionType === 'approve') {
                if (packet.isTrusted) {
                    player.score += 50;
                    this.stats.correctDecisions++;
                    showStatusMessage("OK: Trusted Traffic Allowed (+50 PTS)", 1000);
                } else {
                    player.score -= 75;
                    this.stats.wrongDecisions++;
                    showStatusMessage("FAIL: Allowed Unknown Destination! (-75 PTS)", 1500);
                }
            } else if (actionType === 'blacklist') {
                if (!packet.isTrusted) {
                    player.score += 50;
                    this.stats.correctDecisions++;
                    showStatusMessage("OK: Malicious Connection Blocked (+50 PTS)", 1000);
                } else {
                    player.score -= 60;
                    this.stats.wrongDecisions++;
                    showStatusMessage("FAIL: Blocked Critical Update Server! (-60 PTS)", 1500);
                }
            }
        } else if (packet.risk === "low") {
            player.score -= 40;
            player.phaseScores.ids -= 40;
            this.stats.falsePos++;
            showStatusMessage("ERR: Blocked Legitimate SCADA Traffic (-40 PTS)", 1200);
        }

        // Immediate visual update for the element to fix button responsiveness
        const el = document.getElementById(packet.id);
        if (el) {
            el.style.background = "rgba(40,40,40,0.5)";
            el.style.borderColor = "#555";
            el.style.color = "#777";
            const btnArea = el.querySelector(".pkt-action");
            const finalTag = actionType === 'approve' ? 'ALLOWED' : 'BLOCKED';
            if (btnArea) btnArea.innerHTML = `<span style="font-size:18px; color:#888; font-style: italic;">[ ${finalTag} ]</span>`;
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
                            <h2 style="margin:0; color:var(--retro-green); font-size: 38px; text-shadow:0 0 15px var(--retro-green);">NETWORK INTRUSION MONITOR</h2>
                            <p style="color:#aaa; margin:5px 0 0 0; font-size: 20px;">[VERIFY]: Block <span style="color:#ff2d44; font-weight:bold;">RED</span> alerts. Analyze <span style="color:#ffae00; font-weight:bold;">ORANGE</span> destinations.</p>
                        </div>
                        <div style="text-align:right; min-width: 450px; display: flex; flex-direction: column; align-items: flex-end;">
                            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 5px;">
                                <div id="ids-timer-text" style="color:var(--neon-yellow); font-size:44px; font-weight:bold; letter-spacing: 2px;">SESSION ACTIVE</div>
                                <div id="ids-help-btn" style="width:40px; height:40px; border:3px solid var(--retro-green); color:var(--retro-green); display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size:28px; border-radius: 4px; background: rgba(0,0,0,0.5);">?</div>
                            </div>
                            <div id="ids-score-text" style="color:white; font-size:28px;">TOTAL SCORE: 0</div>
                        </div>
                    </div>
                    <div id="ids-view-port" style="position:relative; flex:1; background:#020508; border:3px solid #222; overflow:hidden; box-shadow:inset 0 0 100px rgba(0,0,0,0.9); border-radius: 4px;">
                        <div id="ids-grid" style="position:absolute; inset:0; background-image: linear-gradient(rgba(57,255,20,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.03) 1px, transparent 1px); background-size: 100px 100px;"></div>
                        <div style="position:absolute; top:10px; right: 20px; color: #444; font-size: 14px; font-family: monospace;">TRUSTED ENDPOINTS: MS Update, UbuntuRepo, EdgeSecurity, DefenderCloud, IntUpdate</div>
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

                let actionHtml = "";
                if (p.risk === "med") {
                    actionHtml = `
                        <button style="padding:10px 15px; font-size:16px; font-weight: 800; background:rgba(0,0,0,0.7); border:2px solid #ffae00; color:#ffae00; cursor:pointer;" onclick="IDSPhase.processPacket('${p.id}', 'blacklist')">BLACKLIST</button>
                        <button style="padding:10px 15px; font-size:16px; font-weight: 800; background:rgba(0,0,0,0.7); border:2px solid #39ff14; color:#39ff14; cursor:pointer; margin-left: 10px;" onclick="IDSPhase.processPacket('${p.id}', 'approve')">APPROVE</button>
                    `;
                } else {
                    actionHtml = `<button style="padding:12px 35px; font-size:22px; font-weight: 900; background:rgba(0,0,0,0.8); border:3px solid ${p.color}; color:${p.color}; cursor:pointer; text-transform:uppercase;" onclick="IDSPhase.processPacket('${p.id}', 'block')">BLOCK</button>`;
                }

                pEl.innerHTML = `
                    <div style="font-family:'Courier New', monospace; min-width: 26rem; font-size: 17px; line-height: 1.1;">
                        <span style="color:#888;">[${p.timestamp}]</span><br>
                        <span style="font-weight:bold;">SRC: ${p.source}</span><br>
                        <span style="font-weight:bold; color: ${p.risk === 'med' ? '#fff' : p.color}">DST: ${p.dest} <br><small style="color:#aaa">${p.destLabel}</small></span>
                    </div>
                    <div style="flex:1; text-align:center; font-size: 24px; font-weight: 800; letter-spacing: 2px;">
                        ${p.type}
                    </div>
                    <div class="pkt-action" style="min-width: 18rem; text-align: right;">
                        ${actionHtml}
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
        panel.style.width = "800px";
        panel.style.padding = "40px";
        panel.style.textAlign = "center";
        panel.style.borderColor = "var(--neon-yellow)";
        panel.style.boxShadow = "0 0 50px var(--neon-yellow)";

        const totalCritical = this.stats.blocked + this.stats.missed;
        const criticalEffectiveness = totalCritical === 0 ? 100 : Math.round((this.stats.blocked / totalCritical) * 100);

        const totalMed = this.stats.correctDecisions + this.stats.wrongDecisions;
        const medEffectiveness = totalMed === 0 ? 100 : Math.round((this.stats.correctDecisions / totalMed) * 100);

        const overall = Math.round((criticalEffectiveness + medEffectiveness) / 2);

        let grade = "F";
        let color = "#ff2d44";
        if (overall >= 95) { grade = "A+"; color = "#39ff14"; }
        else if (overall >= 85) { grade = "A"; color = "#39ff14"; }
        else if (overall >= 75) { grade = "B"; color = "#39ff14"; }
        else if (overall >= 60) { grade = "C"; color = "#ffae00"; }
        else if (overall >= 40) { grade = "D"; color = "#ffae00"; }

        panel.innerHTML = `
            <h1 style="color:var(--neon-yellow); margin-top:0; font-size: 42px; letter-spacing: 5px;">IDS PERFORMANCE AUDIT</h1>
            <div style="color: #666; margin-bottom: 20px; font-size: 16px;">SEC-LOG ANALYSIS COMPLETE</div>
            <hr style="border-color:rgba(255,255,0,0.3); margin:20px 0;">

            <div style="display:grid; grid-template-columns: 1fr 100px; gap: 15px; text-align: left; margin: 0 auto 30px; font-size: 20px; max-width: 650px;">
                <div style="color:#ff2d44; font-weight:bold;">[CRITICAL] Attacks Detained:</div><div style="color:white; font-weight:bold; text-align: right;">${this.stats.blocked}/${totalCritical}</div>
                <div style="color:#ffae00; font-weight:bold;">[SUSPICIOUS] Correct Decisons:</div><div style="color:white; font-weight:bold; text-align: right;">${this.stats.correctDecisions}/${totalMed}</div>
                <div style="color:#aaa;">False Positives (Blocked Good):</div><div style="color:white; text-align: right;">${this.stats.falsePos}</div>
            </div>

            <div style="background: rgba(0,0,0,0.7); padding: 30px; border-radius: 12px; border: 2px solid #444; margin-bottom: 30px;">
                <div style="font-size: 20px; color: #888; margin-bottom: 10px; letter-spacing: 3px;">SECURITY CLEARANCE GRADE</div>
                <div style="font-size: 100px; font-weight: bold; color: ${color}; text-shadow: 0 0 40px ${color}">
                    ${grade}
                </div>
                <div style="font-size: 24px; color: #fff; margin-top: 10px;">${overall}% Total Accuracy</div>
            </div>

            <button style="font-size:28px; padding:15px 60px; border-color:var(--retro-green); color:var(--retro-green); cursor: pointer; font-weight: bold;" onclick="IDSPhase.finish()">PROCEED TO COMMAND CENTER >></button>
        `;
        ui.appendChild(panel);
    },

    finish() {
        this.stop();
        player.progress.ids = true;
        player.idsStats = { ...this.stats }; // Save stats for the certificate
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
