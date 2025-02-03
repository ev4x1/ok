const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;  // Change to any port you want
const API_KEY = "ev4x"; // Replace with your own API key

app.get("/check_banned", async (req, res) => {
    const { key, uid } = req.query;

    // Security Check: Validate API Key
    if (key !== API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    // Validate UID
    if (!uid) {
        return res.status(400).json({ error: "Missing player UID" });
    }

    try {
        // Forward Request to Free Fire API
        const response = await axios.get(`https://ff.garena.com/api/antihack/check_banned?lang=en&uid=${uid}`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "en-US,en;q=0.9",
                "priority": "u=1, i",
                "referer": "https://ff.garena.com/en/support/",
                "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
                "x-requested-with": "B6FksShzIgjfrYImLpTsadjS86sddhFH",
                "cookie": "_ga_G8QGMJPWWV=GS1.1.1730174596.1.1.1730174602.0.0.0; _gid=GA1.2.1004321930.1738552682; _ga_57E30E1PMN=GS1.2.1738552682.4.1.1738552815.0.0.0; datadome=00gYZzKpiTkG2IEVmn52B_I2J1gQW_8t4yhPfnhDzm~LWwuTFzPmRs6JmJ6w_tUjl3pP7CLdQjVRqYjy5kC1WMWc8mtP36HxxV1sjPyJj8gbp7CBvyxVtG22X6SZ1RWh; sso_key=296d366db2658e12f786d074b834a92f5b7e67c77cd1e785b50daefe6cc8964a; token_session=8830d7018e8129c16c09fdbad7c48599e383d3d0fd0a8bd850a951e886c0996adecd0116d7cbb0b084f6599b65fd3ea6; _ga_XB5PSHEQB4=GS1.1.1738584875.2.0.1738584876.0.0.0; _ga_KE3SY7MRSD=GS1.1.1738584784.7.1.1738585534.0.0.0; _ga_RF9R6YT614=GS1.1.1738584785.7.1.1738585534.0.0.0; _ga=GA1.2.112210297.1730174597"
            }
        });

        // Check if the account is banned or not
        const data = response.data.data;
        if (data.is_banned === 0) {
            return res.json({ status: "success", msg: "Account is Not Banned" });
        }

        // Send the full response if the account is banned or other status
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error Forwarding Request:", error.message);
        res.status(500).json({ error: "Failed to fetch data from Free Fire API" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Proxy API running at http://localhost:${PORT}/check_banned?key=api_key&uid=player_uid`);
});