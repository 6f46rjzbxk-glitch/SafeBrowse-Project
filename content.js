(function () {

  let score = 0;

  let reasons = [];

  const url = window.location.href;

  const host = window.location.hostname.toLowerCase();

const gamblingSites = [
  "1xbet",
  "fonbet",
  "parimatch",
  "olimp",
  "olymp",
  "bet365",
  "pinup",
  "winline",
  "leon",
  "mostbet"
];

let gamblingDetected = false;

gamblingSites.forEach(site => {

  if (host.includes(site)) {

    gamblingDetected = true;

    reasons.push(
      "Бұл сайт букмекерлік немесе құмар ойын платформасына жатады"
    );

  }

});

  function addRisk(points, reason) {

    score += points;

    reasons.push(reason);
  }

  // URL тексеру

  if (url.length > 90) {

    addRisk(15, "URL мекенжайы өте ұзын");
  }

  if (url.includes("@")) {

    addRisk(25, "URL ішінде @ белгісі бар");
  }

  const suspiciousWords = [
    "login",
    "verify",
    "secure",
    "account",
    "payment",
    "confirm"
  ];

  suspiciousWords.forEach(word => {

    if (host.includes(word)) {

      addRisk(10, `Күмәнді сөз анықталды: ${word}`);
    }
  });

  const suspiciousZones = [
    ".xyz",
    ".top",
    ".click",
    ".shop"
  ];

  suspiciousZones.forEach(zone => {

    if (host.endsWith(zone)) {

      addRisk(20, `Күмәнді домен аймағы: ${zone}`);
    }
  });

  // Fake brand detection

  const brands = [
    "paypal",
    "google",
    "facebook",
    "instagram",
    "amazon",
    "kaspi",
    "halyk"
  ];

  const extraWords = [
    "login",
    "secure",
    "verify",
    "support",
    "payment",
    "confirm"
  ];

  brands.forEach(brand => {

    extraWords.forEach(word => {

      if (
        host.includes(brand) &&
        host.includes(word)
      ) {

        addRisk(
          30,
          `Брендке ұқсас күмәнді домен: ${brand}`
        );
      }

    });

  });

  // Form analyzer

  const inputs = Array.from(
    document.querySelectorAll("input")
  );

  let sensitiveInputs = [];

  inputs.forEach(input => {

    const text = (
      (input.type || "") + " " +
      (input.name || "") + " " +
      (input.placeholder || "")
    ).toLowerCase();

    if (text.includes("password")) {

      sensitiveInputs.push(input);

      addRisk(25, "Құпиясөз өрісі анықталды");
    }

    if (
      text.includes("card") ||
      text.includes("cvv")
    ) {

      sensitiveInputs.push(input);

      addRisk(35, "Банк картасы өрісі анықталды");
    }

    if (
      text.includes("email") ||
      text.includes("login")
    ) {

      addRisk(15, "Login немесе email өрісі анықталды");
    }

  });

  // Form action тексеру

  const forms = Array.from(
    document.querySelectorAll("form")
  );

  forms.forEach(form => {

    const action = form.getAttribute("action");

    if (action) {

      try {

        const actionUrl =
          new URL(action, window.location.href);

        if (
          actionUrl.hostname !==
          window.location.hostname
        ) {

          addRisk(
            35,
            "Форма басқа доменге дерек жібереді"
          );
        }

      }

      catch (e) {}

    }

  });

  if (score > 100) {
    score = 100;
  }

  // input highlight

  sensitiveInputs.forEach(input => {

    input.style.border =
      "3px solid #ef4444";

    input.style.boxShadow =
      "0 0 10px #ef4444";
  });

  // floating panel

  const oldPanel =
    document.getElementById(
      "safebrowse-panel"
    );

  if (oldPanel) {
    oldPanel.remove();
  }

  const panel =
    document.createElement("div");

  panel.id = "safebrowse-panel";

  let status = "ҚАУІПСІЗ";

  let color = "#14532d";

  if (score >= 70) {

    status = "ҚАУІПТІ";

    color = "#7f1d1d";
  }

  else if (score >= 35) {

    status = "КҮМӘНДІ";

    color = "#713f12";
  }

  panel.innerHTML = `
    <div style="font-size:18px;font-weight:bold;margin-bottom:6px;">
      🛡 SafeBrowse
    </div>

    <div>
      Қауіп деңгейі:
      <b>${score}%</b>
    </div>

    <div>
      Статус:
      <b>${status}</b>
    </div>
  `;

  panel.style.position = "fixed";

  panel.style.right = "20px";

  panel.style.bottom = "20px";

  panel.style.width = "260px";

  panel.style.background = color;

  panel.style.color = "white";

  panel.style.padding = "16px";

  panel.style.borderRadius = "16px";

  panel.style.zIndex = "999999";

  panel.style.fontFamily =
    "Arial,sans-serif";

  panel.style.boxShadow =
    "0 0 20px rgba(0,0,0,0.5)";

  document.body.appendChild(panel);

  return {
    url,
    score,
    reasons
  };

})();