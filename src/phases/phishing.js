const PhishingPhase = {
    emails: [],
    currentEmailIndex: 0,
    stats: { caught: 0, missed: 0, falsePositives: 0 },
    initialized: false,

    init() {
        this.stats = { caught: 0, missed: 0, falsePositives: 0 };
        this.currentEmailIndex = 0;
        this.initialized = true;

        this.emails = [
            {
                id: "EML-001",
                senderName: "IT Support",
                senderEmail: "admin@scada-updater.com",
                subject: "URGENT: Password Expiry Notification",
                body: "Your Active Directory password expires in 2 hours. Click the link below to verify your credentials to prevent account lockout.<br><br>Failure to comply will result in immediate network disconnect.",
                linkText: "Update Password Now",
                actualLink: "http://www.scada-upd4ter.com/login",
                isPhishing: true,
                processed: false,
                reason: "Suspicious sender domain (scada-updater.com instead of internal) and a deceptive link (scada-upd4ter.com). High urgency is a classic social engineering tactic."
            },
            {
                id: "EML-002",
                senderName: "HR Department",
                senderEmail: "hr@company.com",
                subject: "Updated Holiday Schedule",
                body: "Please review the attached PDF for the updated holiday schedule for the upcoming year.<br><br>Best Regards,<br>HR Team",
                linkText: "View Schedule (SharePoint)",
                actualLink: "https://intranet.company.com/hr/holiday-schedule",
                isPhishing: false,
                processed: false,
                reason: "Valid internal sender domain and a valid internal intranet link."
            },
            {
                id: "EML-003",
                senderName: "CEO Office",
                senderEmail: "ceo.office@mail-company.net",
                subject: "Confidential: Q3 Bonus Structure",
                body: "As discussed, please review the confidential Q3 bonus structure allocation document.<br><br>Do not share this link with anyone else in your department.",
                linkText: "Download Q3_Bonus_Confidential.pdf",
                actualLink: "http://malware-drop.host/payload.exe",
                isPhishing: true,
                processed: false,
                reason: "Sender domain is incorrect (mail-company.net), tone is highly secretive to provoke curiosity, and the link points to an executable payload instead of a PDF."
            },
            {
                id: "EML-004",
                senderName: "Vendor Portal",
                senderEmail: "noreply@vendor-portal.com",
                subject: "Invoice #9942 Due for Firmware Subscription",
                body: "Your annual firmware update subscription is expiring today. Please process the invoice attached immediately to ensure uninterrupted service for your PLCs.",
                linkText: "Pay Invoice #9942",
                actualLink: "http://billing.vendor-p0rtal.com/pay",
                isPhishing: true,
                processed: false,
                reason: "Urgency to pay an invoice, coupled with a typo-squatted domain in the link (vendor-p0rtal.com)."
            },
            {
                id: "EML-005",
                senderName: "SCADA Admin",
                senderEmail: "admin@company.com",
                subject: "Scheduled Maintenance Notification",
                body: "The historical database will be taken offline for routine maintenance this Saturday at 02:00 AM. Expected downtime is 4 hours.<br><br>No action is required from your end.",
                linkText: "View Maintenance Log",
                actualLink: "https://intranet.company.com/it/maintenance-logs",
                isPhishing: false,
                processed: false,
                reason: "Standard informational notification with no urgent action required, valid internal domain and links."
            }
        ];
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
        panel.style.display = "flex";
        panel.style.flexDirection = "column";

        // HEADER
        const header = document.createElement("div");
        header.className = "panel-header";
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; color:var(--retro-green); text-shadow:0 0 15px var(--retro-green);">SECURE EMAIL INBOX</h2>
                <div style="display:flex; align-items:center; gap:20px;">
                    <h2 style="margin:0; color:var(--neon-red); text-shadow:0 0 10px var(--neon-red);">SCORE: ${player.score}</h2>
                    <div id="mail-help-btn" style="width:30px; height:30px; border:2px solid var(--retro-green); color:var(--retro-green); display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size:20px;">?</div>
                </div>
            </div>
            <p style="color:var(--retro-green);">Inspect incoming communications. Identify phishing attempts by verifying sender domains and hovering over links to check destinations.</p>
        `;
        panel.appendChild(header);

        setTimeout(() => {
            const btn = document.getElementById("mail-help-btn");
            if (btn) btn.onclick = () => HelpSystem.showHelp();
        }, 0);

        // CONTENT AREA (Split Left/Right)
        const content = document.createElement("div");
        content.style.display = "flex";
        content.style.flex = "1";
        content.style.borderTop = "2px solid var(--retro-green)";
        content.style.borderBottom = "2px solid var(--retro-green)";
        content.style.overflow = "hidden";

        // Left Sidebar: Inbox List
        const inboxList = document.createElement("div");
        inboxList.style.flex = "1";
        inboxList.style.borderRight = "2px solid var(--retro-green)";
        inboxList.style.padding = "10px";
        inboxList.style.overflowY = "auto";
        inboxList.style.background = "rgba(0,0,0,0.5)";

        this.emails.forEach((email, index) => {
            const btn = document.createElement("button");
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.padding = "15px 10px";
            btn.style.marginBottom = "5px";
            btn.style.border = "1px solid var(--retro-green)";
            btn.style.background = index === this.currentEmailIndex ? "rgba(57, 255, 20, 0.2)" : "transparent";
            btn.style.color = email.processed ? "#555" : "var(--retro-green)";
            btn.style.cursor = "pointer";
            
            btn.innerHTML = `
                <div style="font-weight:bold; font-size: 16px;">${email.senderName}</div>
                <div style="font-size: 14px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${email.subject}</div>
                ${email.processed ? `<div style="font-size: 12px; color: #aaa; margin-top: 5px;">[ PROCESSED ]</div>` : ``}
            `;

            btn.onclick = () => {
                this.currentEmailIndex = index;
                this.render();
            };
            inboxList.appendChild(btn);
        });

        // Right Pane: Email Reader
        const reader = document.createElement("div");
        reader.style.flex = "2";
        reader.style.padding = "30px";
        reader.style.display = "flex";
        reader.style.flexDirection = "column";
        reader.style.overflowY = "auto";

        const currentEmail = this.emails[this.currentEmailIndex];

        if (currentEmail) {
            reader.innerHTML = `
                <div style="margin-bottom: 20px; font-size: 18px; border-bottom: 1px dotted var(--retro-green); padding-bottom: 10px;">
                    <div><span style="color:#aaa;">From:</span> <span style="color:#fff;">${currentEmail.senderName} &lt;${currentEmail.senderEmail}&gt;</span></div>
                    <div><span style="color:#aaa;">To:</span> <span style="color:#fff;">Operator &lt;operator@company.com&gt;</span></div>
                    <div style="margin-top: 10px; font-size: 22px; font-weight: bold; color: var(--neon-cyan);">${currentEmail.subject}</div>
                </div>
                <div style="font-size: 18px; line-height: 1.6; color: #ddd; flex: 1;">
                    ${currentEmail.body}
                    <div style="margin-top: 30px;">
                        <a href="#" id="phishing-link" style="color: var(--neon-cyan); text-decoration: underline; font-weight: bold; padding: 10px; border: 1px dotted var(--neon-cyan); display: inline-block;">${currentEmail.linkText}</a>
                    </div>
                </div>
                <div id="link-preview-bar" style="height: 30px; background: #222; border: 1px solid #555; color: #aaa; padding: 5px 10px; font-family: monospace; font-size: 14px; margin-top: 20px; display: flex; align-items: center;">
                    Hover over links to reveal destination...
                </div>
            `;

            if (!currentEmail.processed) {
                const actionArea = document.createElement("div");
                actionArea.style.display = "flex";
                actionArea.style.gap = "20px";
                actionArea.style.marginTop = "30px";
                actionArea.style.paddingTop = "20px";
                actionArea.style.borderTop = "1px solid var(--retro-green)";

                const reportBtn = document.createElement("button");
                reportBtn.innerText = "🚨 REPORT AS PHISHING";
                reportBtn.style.flex = "1";
                reportBtn.style.padding = "15px";
                reportBtn.style.fontSize = "18px";
                reportBtn.style.borderColor = "var(--neon-red)";
                reportBtn.style.color = "var(--neon-red)";
                reportBtn.onclick = () => this.processEmail(true);

                const safeBtn = document.createElement("button");
                safeBtn.innerText = "✅ MARK SAFE & ALLOW";
                safeBtn.style.flex = "1";
                safeBtn.style.padding = "15px";
                safeBtn.style.fontSize = "18px";
                safeBtn.style.borderColor = "var(--retro-green)";
                safeBtn.style.color = "var(--retro-green)";
                safeBtn.onclick = () => this.processEmail(false);

                actionArea.appendChild(reportBtn);
                actionArea.appendChild(safeBtn);
                reader.appendChild(actionArea);
            } else {
                const resultArea = document.createElement("div");
                resultArea.style.marginTop = "30px";
                resultArea.style.padding = "20px";
                resultArea.style.background = "rgba(0,0,0,0.5)";
                resultArea.style.border = "1px solid #555";
                resultArea.innerHTML = `<h3 style="color:var(--neon-yellow); margin-top:0;">ANALYSIS REPORT</h3><p style="color:#fff; font-size:16px;">${currentEmail.reason}</p>`;
                reader.appendChild(resultArea);
            }
        }

        content.appendChild(inboxList);
        content.appendChild(reader);
        panel.appendChild(content);

        // FOOTER
        const footer = document.createElement("div");
        footer.className = "panel-footer";
        footer.style.padding = "15px";
        footer.style.textAlign = "center";

        const allProcessed = this.emails.every(e => e.processed);
        
        const proceedBtn = document.createElement("button");
        proceedBtn.innerText = "PROCEED TO ACCESS CONTROL >>";
        proceedBtn.style.padding = "15px 40px";
        proceedBtn.style.fontSize = "20px";
        proceedBtn.style.fontWeight = "bold";
        proceedBtn.style.cursor = allProcessed ? "pointer" : "not-allowed";
        proceedBtn.style.color = allProcessed ? "var(--retro-green)" : "#444";
        proceedBtn.style.borderColor = allProcessed ? "var(--retro-green)" : "#444";
        proceedBtn.style.background = "transparent";
        proceedBtn.style.borderWidth = "2px";

        proceedBtn.onclick = () => {
            if (allProcessed) {
                this.finishPhase();
            } else {
                showStatusMessage("ERROR: YOU MUST REVIEW ALL EMAILS BEFORE PROCEEDING.");
            }
        };

        footer.appendChild(proceedBtn);
        panel.appendChild(footer);

        ui.appendChild(panel);

        // Attach hover logic after rendering
        if (currentEmail) {
            const linkEl = document.getElementById("phishing-link");
            const previewBar = document.getElementById("link-preview-bar");
            if (linkEl && previewBar) {
                linkEl.onmouseover = () => {
                    previewBar.innerText = `Dest: ${currentEmail.actualLink}`;
                    previewBar.style.color = "#fff";
                    previewBar.style.borderColor = "#fff"; // slight highlight
                };
                linkEl.onmouseout = () => {
                    previewBar.innerText = `Hover over links to reveal destination...`;
                    previewBar.style.color = "#aaa";
                    previewBar.style.borderColor = "#555";
                };
                linkEl.onclick = (e) => {
                    e.preventDefault();
                    showStatusMessage("WARNING: LINKS DISABLED IN SECURE PREVIEW MODE.", 2000);
                };
            }
        }
    },

    processEmail(markedAsPhishing) {
        const email = this.emails[this.currentEmailIndex];
        email.processed = true;

        let points = 0;
        let msg = "";

        if (markedAsPhishing) {
            if (email.isPhishing) {
                points = 40;
                msg = "SUCCESS: Phishing Attempt Thwarted!";
                this.stats.caught++;
            } else {
                points = -20;
                msg = "WARNING: Legitimate Email Blocked (False Positive).";
                player.incidents.push(`Blocked legitimate comms from ${email.senderName}`);
                this.stats.falsePositives++;
            }
        } else {
            // Marked Safe
            if (email.isPhishing) {
                points = -50;
                msg = "CRITICAL FAIL: Malware Executed via Phishing Link!";
                player.incidents.push(`Fell for social engineering from ${email.senderEmail}`);
                this.stats.missed++;
            } else {
                points = 20;
                msg = "SUCCESS: Valid Communication Allowed.";
            }
        }

        player.score += points;
        player.phaseScores.phishing += points;
        showStatusMessage(`${msg} (${points > 0 ? '+' : ''}${points} PTS)`);

        // Automatically select the next unprocessed email if available
        const nextIndex = this.emails.findIndex(e => !e.processed);
        if (nextIndex !== -1) {
            this.currentEmailIndex = nextIndex;
        }

        this.render();
    },

    finishPhase() {
        player.progress.phishing = true;
        player.phishingStats = { ...this.stats }; // Save for certificate
        showStatusMessage("INBOX SECURED. MOVING TO ACCESS CONTROL...", 4000);
        setTimeout(() => {
            currentState = GameState.ACCESS_MGMT;
            document.getElementById("ui-layer").classList.add("hidden");
        }, 1500);
    }
};

window.PhishingPhase = PhishingPhase;
