document.addEventListener("DOMContentLoaded", async () => {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.id) {
    return;
  }

  if (
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("edge://") ||
    tab.url.startsWith("chrome-extension://")
  ) {

    document.getElementById("status").textContent =
      "Бұл бет тексерілмейді";

    return;
  }

  try {

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    const data = results[0].result;

    document.getElementById("score").textContent =
      data.score + "%";

    document.getElementById("url").textContent =
      data.url;

    const fill = document.getElementById("fill");

    fill.style.width = data.score + "%";

    const score = document.getElementById("score");
    const status = document.getElementById("status");

    if (data.score >= 70) {

      status.textContent = "🔴 ҚАУІПТІ";

      score.style.color = "#ef4444";

      fill.style.background = "#ef4444";

    }

    else if (data.score >= 35) {

      status.textContent = "🟡 КҮМӘНДІ";

      score.style.color = "#facc15";

      fill.style.background = "#facc15";

    }

    else {

      status.textContent = "🟢 ҚАУІПСІЗ";

      score.style.color = "#22c55e";

      fill.style.background = "#22c55e";
    }

    document.getElementById("reasons").innerHTML =
      data.reasons.length > 0
        ? data.reasons.map(r => "⚠ " + r).join("<br>")
        : "✅ Қауіпті белгі табылмады";

  }

  catch (e) {

    document.getElementById("status").textContent =
      "Тексеру мүмкін болмады";
  }

});