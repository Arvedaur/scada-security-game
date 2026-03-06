
const HelpSystem = {
    content: {
        [GameState.MAIN_PAGE]: {
            title: "OPERATIONAL MAP",
            text: "Welcome to the Grid Control Center. Click on different sectors (WTG, BESS, SOLAR, SUBSTATION, OPGW) to inspect individual assets. Your goal is to collect all critical equipment for security analysis."
        },
        [GameState.WTG]: {
            title: "WIND TURBINE GENERATOR (WTG)",
            text: "You are inside a wind farm sector. Locate and click on critical internal components (PLCs, Switches, CMUs) to add them to your secure inventory."
        },
        [GameState.BESS]: {
            title: "BATTERY ENERGY STORAGE SYSTEM (BESS)",
            text: "This sector manages power stability. Collect EMS servers, BMS controllers, and OT firewalls for assessment."
        },
        [GameState.SOLAR]: {
            title: "SOLAR ARRAY DELTA",
            text: "Critical infrastructure for renewable generation. Secure the Inverters, Scada Servers, and RTUs found in this field."
        },
        [GameState.SUBSTATION]: {
            title: "PRIMARY SUBSTATION",
            text: "The heart of the power distribution grid. Many high-value assets here, including Core Switches, IED Relays, and Engineering Workstations."
        },
        [GameState.OPGW]: {
            title: "OPTICAL GROUND WIRE (OPGW)",
            text: "The communication backbone of the grid. Ensure the Optical Terminals and SDH/SONET equipment are identified."
        },
        [GameState.ASSET_INVENTORY]: {
            title: "ASSET REGISTER",
            text: "Review all the equipment you've collected. Once you are confident you've secured everything, LOCK the register. WARNING: You cannot go back to collect more items after locking."
        },
        [GameState.PATCH_MGMT]: {
            title: "PATCH MANAGEMENT",
            text: "Analyze the 'KB' patches for each asset. Select patches that have a high Risk Score, meet CVSS requirements (>9.0), and are Official Vendor signed. Avoid excessive downtime!"
        },
        [GameState.ACCESS_MGMT]: {
            title: "ACCESS CONTROL",
            text: "Review user permissions. Revoke (DENY) any access rights that are not strictly necessary for standard operations to minimize attack surface."
        },
        [GameState.BCM_DR]: {
            title: "DISASTER RECOVERY (BCM/DR)",
            text: "Finalize the recovery protocols. Ensure backup systems and redundant paths are correctly configured to survive a cyber incident."
        }
    },

    showHelp() {
        const state = currentState;
        const info = this.content[state] || { title: "SYSTEM HELP", text: "No specific help available for this section." };

        // Use a simple alert or status message for now, or create a custom modal
        showDecisionDialog(info.title, info.text, null, "CLOSE HELP");
    }
};
