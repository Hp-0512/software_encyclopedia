const express = require("express");
const router = express.Router();

/* ---------------- NORMALIZATION ---------------- */

function normalize(text = "") {
    return text.toLowerCase().trim();
}

/* ---------------- FUZZY MATCH ---------------- */

function similarity(a, b) {
    a = normalize(a);
    b = normalize(b);
    let matches = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) matches++;
    }
    return matches / Math.max(a.length, b.length);
}

function findSoftware(message, softwares) {
    const msg = normalize(message);

    let best = null;
    let bestScore = 0;

    softwares.forEach((s) => {
        const name = normalize(s.SoftwareName || "");
        if (!name) return;

        if (msg.includes(name)) {
            best = s;
            bestScore = 1;
        } else {
            const score = similarity(msg, name);
            if (score > bestScore && score > 0.6) {
                best = s;
                bestScore = score;
            }
        }
    });

    return best;
}

/* ---------------- INTENT DETECTION ---------------- */

const has = (m, arr) => arr.some((w) => m.includes(w));

function detectIntent(message) {
    const m = normalize(message);

    if (m.includes(" vs ") || m.includes("compare"))
        return "compare";

    if (has(m, ["download", "setup", "installer", "apk", "link"]))
        return "download";

    if (has(m, ["review", "rating", "feedback"]))
        return "review";

    if (has(m, ["best", "top", "recommend"]))
        return "recommend";

    return "info";
}

/* ---------------- REVIEW ANALYTICS ---------------- */

function reviewStats(reviews) {
    if (!reviews.length) return null;

    const total = reviews.reduce(
        (sum, r) => sum + Number(r.rating || 0),
        0
    );

    const avg = total / reviews.length;

    let sentiment = "⚠️ Poor";
    if (avg >= 4.5) sentiment = "🔥 Excellent";
    else if (avg >= 3.5) sentiment = "👍 Good";
    else if (avg >= 2.5) sentiment = "🙂 Mixed";

    return {
        avg: avg.toFixed(1),
        count: reviews.length,
        sentiment,
    };
}

/* ---------------- MAIN ROUTE ---------------- */

router.post("/", async (req, res) => {
    try {
        const { message, softwares = [], reviews = [] } =
            req.body;

        if (!message)
            return res.json({ reply: "⚠️ Please type something." });

        const intent = detectIntent(message);

        /* ----------- COMPARISON ----------- */

        if (intent === "compare") {
            const names = message.split("vs");
            if (names.length < 2)
                return res.json({
                    reply: "⚠️ Please mention two softwares to compare.",
                });

            const s1 = findSoftware(names[0], softwares);
            const s2 = findSoftware(names[1], softwares);

            if (!s1 || !s2)
                return res.json({
                    reply:
                        "⚠️ One or both softwares not found in database.",
                });

            return res.json({
                reply: `⚔️ Software Comparison

${s1.SoftwareName}
${s1.ShortDescription || s1.Description}

VS

${s2.SoftwareName}
${s2.ShortDescription || s2.Description}`,
            });
        }

        /* ----------- RECOMMEND / BEST ----------- */

        if (intent === "recommend") {

            if (!reviews.length)
                return res.json({
                    reply: "⚠️ No ratings available to recommend software.",
                });

            const messageText = message.toLowerCase();

            // detect category from message
            const filteredSoftwares = softwares.filter((s) =>
                s.CategoryName?.toLowerCase().includes(messageText) ||
                s.Category?.toLowerCase().includes(messageText) ||
                messageText.includes(
                    s.CategoryName?.toLowerCase() || ""
                )
            );

            const candidateSoftwares =
                filteredSoftwares.length > 0
                    ? filteredSoftwares
                    : softwares;

            const ratingMap = {};

            reviews.forEach((r) => {
                const key =
                    r.softwareId ||
                    r.softwareName?.toLowerCase();

                if (!key) return;

                if (!ratingMap[key]) ratingMap[key] = [];

                ratingMap[key].push(Number(r.rating || 0));
            });

            let bestSoftware = null;
            let bestAvg = 0;

            candidateSoftwares.forEach((s) => {

                const idKey = s._id || s.id;
                const nameKey = s.SoftwareName?.toLowerCase();

                const ratings =
                    ratingMap[idKey] ||
                    ratingMap[nameKey];

                if (!ratings) return;

                const avg =
                    ratings.reduce((a, b) => a + b, 0) /
                    ratings.length;

                if (avg > bestAvg) {
                    bestAvg = avg;
                    bestSoftware = s;
                }
            });

            if (!bestSoftware)
                return res.json({
                    reply: "⚠️ Unable to recommend software.",
                });

            return res.json({
                reply: `🏆 Recommended Software

${bestSoftware.SoftwareName}
Average Rating: ${bestAvg.toFixed(1)} ⭐`,
            });
        }


        /* ----------- FIND SOFTWARE ----------- */

        const software = findSoftware(message, softwares);

        if (!software)
            return res.json({
                reply:
                    "⚠️ Currently we don’t have any information about it, but we will let you know in future updates.",
            });

        /* ----------- DOWNLOAD ----------- */

        if (intent === "download")
            return res.json({
                reply:
                    "🔗 Download link is available on the Software page. Open that software details page to get official download.",
            });

        /* ----------- REVIEWS ----------- */

        /* ----------- REVIEWS ----------- */

        if (intent === "review") {

            const softwareReviews =
                (reviews || []).filter(
                    (r) =>
                        r.softwareId === software._id ||
                        r.softwareId === software.id ||
                        r.softwareName?.toLowerCase() ===
                        software.SoftwareName?.toLowerCase()
                ) || [];

            const stats = reviewStats(softwareReviews);

            if (!stats)
                return res.json({
                    reply: `📢 ${software.SoftwareName} has no reviews yet.`,
                });

            return res.json({
                reply: `⭐ ${software.SoftwareName} Review Intelligence

Average Rating: ${stats.avg} ⭐
Total Reviews: ${stats.count}
User Sentiment: ${stats.sentiment}`,
            });
        }


        /* ----------- NORMAL INFO ----------- */

        return res.json({
            reply: `✅ ${software.SoftwareName}

${software.ShortDescription || software.Description}`,
        });
    } catch (err) {
        console.log("Ultimate AI Error:", err);
        res.status(500).json({
            reply: "❌ Server error in AI system.",
        });
    }
});

module.exports = router;
