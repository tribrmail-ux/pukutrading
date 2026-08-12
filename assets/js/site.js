/* ==========================================================================
   Puku Trading Trust — site.js

   Everything here is enhancement. With JavaScript off the menu is already
   open in the markup and the enquiry form posts natively.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG
   The WhatsApp number and e-mail are also written into the HTML, so the site
   works without this file. Change them in both places — see README.
   -------------------------------------------------------------------------- */

var PUKU = {
  FORMSPREE_ENDPOINT: "https://formspree.io/f/mwleowok",
  WHATSAPP_NUMBER: "264812545797",
  WHATSAPP_MESSAGE: "Hi Puku Trading, I'd like a quote for ",
  EMAIL: "pukutrading@gmail.com"
};

(function () {
  "use strict";

  /* ---- Menu ------------------------------------------------------------- */
  /* The panel is in normal flow and pushes the page down, so there is no
     positioning, no z-index, no scroll lock and no focus trap to get wrong. */

  var btn = document.querySelector(".menubtn");
  var nav = document.getElementById("nav");

  if (btn && nav) {
    btn.hidden = false;
    nav.setAttribute("data-open", "false");
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

  /* ---- WhatsApp links --------------------------------------------------- */
  /* The markup already carries a working wa.me link; this only keeps them in
     step with CONFIG and adds the page subject to the prefilled message.    */

  var number = String(PUKU.WHATSAPP_NUMBER).replace(/[^0-9]/g, "");
  if (number) {
    var subject = document.body.getAttribute("data-subject") || "";
    var text = PUKU.WHATSAPP_MESSAGE + subject;
    var waLinks = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < waLinks.length; i++) {
      waLinks[i].setAttribute(
        "href",
        "https://wa.me/" + number + "?text=" + encodeURIComponent(text)
      );
    }
  }

  /* ---- Enquiry form ----------------------------------------------------- */

  var forms = document.querySelectorAll(".enquiry-form");

  Array.prototype.forEach.call(forms, function (form) {
    var sent = form.parentNode.querySelector(".sent");
    var button = form.querySelector("[type=submit]");
    var validated = false;

    if (PUKU.FORMSPREE_ENDPOINT.indexOf("[[") === -1) {
      form.setAttribute("action", PUKU.FORMSPREE_ENDPOINT);
    }

    var pageField = form.querySelector("[name=_page]");
    if (pageField) pageField.value = document.title;

    /* Validation messaging. The browser's own constraint validation decides
       what is valid; this only renders the message in the page's own voice
       rather than a native bubble.                                          */
    function check(field) {
      var msg = form.querySelector("#" + field.id + "-err");
      var ok = field.checkValidity();
      field.setAttribute("aria-invalid", ok ? "false" : "true");
      if (msg) {
        msg.textContent = ok
          ? ""
          : field.validity.valueMissing
          ? "Required — please fill this in."
          : "Check this — it does not look complete.";
      }
      return ok;
    }

    var fields = form.querySelectorAll("input[required], textarea[required], input[type=email]");
    Array.prototype.forEach.call(fields, function (field) {
      field.addEventListener("blur", function () {
        if (validated) check(field);
      });
    });

    form.addEventListener("submit", function (e) {
      validated = true;
      var allOk = true;
      Array.prototype.forEach.call(fields, function (field) {
        if (!check(field)) allOk = false;
      });

      if (!allOk) {
        e.preventDefault();
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var action = form.getAttribute("action") || "";
      if (action.indexOf("[[") !== -1 || !window.fetch || !window.FormData) return;

      e.preventDefault();
      if (button) {
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        button.textContent = "Sending…";
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            if (sent) {
              form.hidden = true;
              sent.hidden = false;
              var heading = sent.querySelector("h3");
              if (heading) heading.focus();
            }
            return;
          }
          /* Formspree explains the refusal in the response body. Show it —
             a generic "that did not go through" leaves the visitor and the
             owner with nothing to act on. */
          return res.json().then(
            function (data) {
              var detail =
                data && data.errors && data.errors.length
                  ? data.errors
                      .map(function (err) { return err.message; })
                      .join(" ")
                  : "";
              fail(detail);
            },
            function () { fail(""); }
          );
        })
        .catch(function () { fail(""); })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            button.textContent = "Send enquiry";
          }
        });
    });

    function fail(detail) {
      var note = form.querySelector(".form__fail");
      if (!note) return;
      var why = note.querySelector(".form__why");
      if (why) {
        why.textContent = detail || "";
        why.hidden = !detail;
      }
      note.hidden = false;
    }
  });

  /* ---- Footer year ------------------------------------------------------ */

  var years = document.querySelectorAll("[data-year]");
  for (var y = 0; y < years.length; y++) {
    years[y].textContent = new Date().getFullYear();
  }
})();
