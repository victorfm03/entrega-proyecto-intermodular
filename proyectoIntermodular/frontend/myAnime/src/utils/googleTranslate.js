// src/utils/googleTranslate.js

export const loadGoogleTranslate = () => {
  if (window.googleTranslateElementInit) return;

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "es",
        includedLanguages: "es,en,ja,fr,de",
        autoDisplay: false,
        layout:
          window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
};

export const changeLanguage = (lang) => {
  const googleCombo = document.querySelector(".goog-te-combo");

  if (googleCombo) {
    googleCombo.value = lang;
    googleCombo.dispatchEvent(new Event("change"));
  }

  localStorage.setItem("language", lang);
};