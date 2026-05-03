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
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!language || !window.google?.translate?.TranslateElement) return;

    const languageMap = {
      es: "es",
      en: "en",
      fr: "fr",
      de: "de",
      ja: "ja",
    };

    const targetLang = languageMap[language] || language;
    const combo = document.querySelector(".goog-te-combo");

    if (combo) {
      combo.value = targetLang;
      combo.dispatchEvent(new Event("change"));
    }
  }, [language]);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
}

export default GoogleTranslate;