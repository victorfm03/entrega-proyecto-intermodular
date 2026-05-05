import { useEffect } from "react";

function GoogleTranslate({ language }) {
  useEffect(() => {
    if (window.googleTranslateLoaded) return;
    window.googleTranslateLoaded = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es",
          autoDisplay: false,
          includedLanguages: "es,en,fr,de,pt,ja", // Idiomas permitidos
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.body.appendChild(script);

    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }

      body {
        top: 0px !important;
      }

      iframe.goog-te-banner-frame {
        display: none !important;
      }

      .goog-logo-link {
        display: none !important;
      }

      .goog-te-gadget {
        display: none !important;
      }

      .skiptranslate.goog-te-gadget {
        display: none !important;
      }

      #google_translate_element {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const updateLanguage = () => {
      if (!window.google?.translate?.TranslateElement) {
        setTimeout(updateLanguage, 500);
        return;
      }

      const languageMap = {
        es: "es",
        en: "en",
        fr: "fr",
        de: "de",
        pt: "pt",
        ja: "ja",
      };

      const targetLang = languageMap[language] || "es";
      const combo = document.querySelector(".goog-te-combo");

      if (combo) {
        // Si el idioma es español, Google Translate a veces no reacciona si ya está en el idioma base.
        // Forzamos el cambio o aseguramos que el valor sea correcto.
        if (combo.value !== targetLang) {
          combo.value = targetLang;
          combo.dispatchEvent(new Event("change"));
        }
      } else {
        // Si no existe el combo todavía, reintentamos un poco más tarde
        setTimeout(updateLanguage, 500);
      }
    };

    updateLanguage();
  }, [language]);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
}

export default GoogleTranslate;