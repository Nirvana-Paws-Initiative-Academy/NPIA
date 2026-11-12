export interface SupportedLanguage {
  code: string;
  englishName: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  { code: "en", englishName: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", dir: "ltr" },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr" },
  { code: "ml", englishName: "Malayalam", nativeName: "മലയാളം", dir: "ltr" },
  { code: "kn", englishName: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "pa", englishName: "Punjabi", nativeName: "ਪੰਜਾਬੀ", dir: "ltr" },
  { code: "or", englishName: "Odia", nativeName: "ଓଡ଼ିଆ", dir: "ltr" },
] as const;

export const ALLOWED_LANGUAGE_CODES = new Set<string>(
  SUPPORTED_LANGUAGES.map((item) => item.code)
);

export const LANGUAGE_STORAGE_KEY = "npia_preferred_language";

export function getLanguageMeta(code: string): SupportedLanguage {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ??
    SUPPORTED_LANGUAGES[0]
  );
}
