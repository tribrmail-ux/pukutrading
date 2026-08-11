/* ==========================================================================
   Puku Trading Trust — site.js
   Vanilla JS, no dependencies. Everything here is progressive enhancement:
   if this file fails to load, every page and both forms still work.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — the only things you normally need to change.
   Also see the placeholder checklist in README.md, because the phone
   number, e-mail and Formspree action are written into the HTML too so the
   site keeps working with JavaScript switched off.
   -------------------------------------------------------------------------- */

var PUKU = {
  /* Formspree form ID. Create a form at https://formspree.io, copy the ID
     out of the endpoint it gives you (the part after /f/), and paste it here
     AND into the action="" of every <form class="enquiry-form"> in the HTML. */
  FORMSPREE_ENDPOINT: "https://formspree.io/f/[[FORMSPREE ID]]",

  /* WhatsApp number in full international format, digits only.
     Namibia is country code 264 and you drop the leading 0:
     081 234 5678 becomes 264812345678                                      */
  WHATSAPP_NUMBER: "[[WHATSAPP NUMBER]]",

  /* Pre-filled WhatsApp message. */
  WHATSAPP_MESSAGE: "Hi Puku Trading, I'd like a quote for ",

  /* Fallback inbox, used for the mailto: link under each form. */
  EMAIL: "[[EMAIL]]"
};

(function () {
  "use strict";

  /* ---- Mobile navigation ------------------------------------------------ */

  var toggle = document.querySelector(".navtoggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      toggle.textContent = open ? "Menu" : "Close";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        toggle.click();
        toggle.focus();
      }
    });
  }

  /* ---- WhatsApp links --------------------------------------------------- */
  /* The HTML already carries a working wa.me link. This only keeps every
     WhatsApp link on the page in step with the CONFIG above, and adds the
     name of the page the visitor was reading to the pre-filled message.    */

  var waNumber = String(PUKU.WHATSAPP_NUMBER).replace(/[^0-9]/g, "");
  if (waNumber) {
    var subject = document.body.getAttribute("data-wa-subject") || "";
    var text = PUKU.WHATSAPP_MESSAGE + subject;
    var links = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute(
        "href",
        "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text)
      );
    }
  }

  /* ---- Enquiry forms ---------------------------------------------------- */
  /* Without JS the form does a normal POST to Formspree and Formspree shows
     its own thank-you page. With JS we submit in the background and keep the
     visitor on the page, which matters on a slow connection.                */

  var forms = document.querySelectorAll(".enquiry-form");

  Array.prototype.forEach.call(forms, function (form) {
    var status = form.parentNode.querySelector(".formstatus");
    var button = form.querySelector("[type=submit]");

    /* Keep the action in step with CONFIG if it has been filled in there. */
    if (PUKU.FORMSPREE_ENDPOINT.indexOf("[[") === -1) {
      form.setAttribute("action", PUKU.FORMSPREE_ENDPOINT);
    }

    /* Record which page the enquiry came from. */
    var src = form.querySelector("[name=_source_page]");
    if (src) src.value = document.title;

    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";

      /* Endpoint not configured yet: let the browser do whatever it would
         normally do rather than swallowing the visitor's enquiry. */
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
              "Thank you — your enquiry is in. We will come back to you with a quotation. If it is urgent, send the same details on WhatsApp.",
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
        "That did not go through. Please send your enquiry on WhatsApp or by e-mail instead — the links are just below.",
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

  /* ---- The one piece of motion on the site ------------------------------ */
  /* The strength bar settles from label strength down to measured strength
     the first time it comes into view. Static without JS, and skipped
     entirely when the visitor has asked for reduced motion.                 */

  var scale = document.querySelector(".strength");
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (scale && !still && "IntersectionObserver" in window) {
    var seen = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("strength--anim");
            seen.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    seen.observe(scale);
  }

  /* ---- Year in the footer ----------------------------------------------- */

  var year = document.querySelectorAll("[data-year]");
  for (var y = 0; y < year.length; y++) {
    year[y].textContent = new Date().getFullYear();
  }
})();
