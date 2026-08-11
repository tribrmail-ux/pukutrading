/* ==========================================================================
   Puku Trading Trust — site.js
   Vanilla JS, no dependencies. Everything here is an enhancement: if this
   file fails to load, every page and both forms still work.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — the things you are likely to change.
   The WhatsApp number and e-mail are also written into the HTML so the site
   works with JavaScript switched off. See the README before editing them.
   -------------------------------------------------------------------------- */

var PUKU = {
  /* Formspree form ID. Create a form at https://formspree.io and paste the ID
     (the part after /f/) here AND into the action="" of the two forms in
     index.html and contact.html.                                            */
  FORMSPREE_ENDPOINT: "https://formspree.io/f/mwleowok",

  /* WhatsApp number, digits only, full international format. */
  WHATSAPP_NUMBER: "264812545797",

  /* Pre-filled WhatsApp message. */
  WHATSAPP_MESSAGE: "Hi Puku Trading, I'd like a quote for ",

  EMAIL: "pukutrading@gmail.com"
};

(function () {
  "use strict";

  /* ---- Navigation ------------------------------------------------------- */

  var btn = document.querySelector(".navbtn");
  var nav = document.getElementById("nav");

  if (btn && nav) {
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.textContent = open ? "Menu" : "Close";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        btn.click();
        btn.focus();
      }
    });
  }

  /* ---- WhatsApp --------------------------------------------------------- */
  /* The HTML already carries a working wa.me link. This keeps every link in
     step with CONFIG and adds the page subject to the pre-filled message.   */

  var number = String(PUKU.WHATSAPP_NUMBER).replace(/[^0-9]/g, "");
  if (number) {
    var subject = document.body.getAttribute("data-subject") || "";
    var text = PUKU.WHATSAPP_MESSAGE + subject;
    var links = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute(
        "href",
        "https://wa.me/" + number + "?text=" + encodeURIComponent(text)
      );
    }
  }

  /* ---- Enquiry forms ---------------------------------------------------- */
  /* Without JS the form posts normally and Formspree shows its own thank-you
     page. With JS it submits in the background, which matters on a slow
     connection.                                                             */

  var forms = document.querySelectorAll(".enquiry");

  Array.prototype.forEach.call(forms, function (form) {
    var status = form.parentNode.querySelector(".status");
    var button = form.querySelector("[type=submit]");

    if (PUKU.FORMSPREE_ENDPOINT.indexOf("[[") === -1) {
      form.setAttribute("action", PUKU.FORMSPREE_ENDPOINT);
    }

    var page = form.querySelector("[name=_page]");
    if (page) page.value = document.title;

    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";

      /* Not configured yet, or no fetch: let the browser do what it would
         normally do rather than swallowing the enquiry. */
      if (action.indexOf("[[") !== -1 || !window.fetch || !window.FormData) return;

      e.preventDefault();
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }
      say("Sending your enquiry…", "busy");

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            say(
              "Thank you — your enquiry has been sent. We will come back to you with a quotation. If it is urgent, send the same details on WhatsApp.",
              "ok"
            );
          } else {
            fail();
          }
        })
        .catch(fail)
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = "Send enquiry";
          }
        });
    });

    function fail() {
      say(
        "That did not go through. Please send your enquiry on WhatsApp or by e-mail instead — both are linked below.",
        "error"
      );
    }

    function say(message, state) {
      if (!status) return;
      status.hidden = false;
      status.textContent = message;
      status.setAttribute("data-state", state);
    }
  });

  /* ---- The single piece of motion --------------------------------------- */
  /* The shortfall bar draws once when it first comes into view. Static
     without JS, and skipped when reduced motion is requested.               */

  var gauge = document.querySelector(".gauge");
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (gauge && !still && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("gauge--seen");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(gauge);
  }

  /* ---- Footer year ------------------------------------------------------ */

  var years = document.querySelectorAll("[data-year]");
  for (var y = 0; y < years.length; y++) {
    years[y].textContent = new Date().getFullYear();
  }
})();
