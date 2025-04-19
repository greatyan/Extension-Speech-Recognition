export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        SpeechRecognition: "readonly",
        webkitSpeechRecognition: "readonly",
        AudioContext: "readonly",
        webkitAudioContext: "readonly",
        $: "readonly",   // Tell ESLint $ is a global variable (for jQuery)
        console: "readonly",
        toastr: "readonly",
        options: "readonly",
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "single"]
    }
  }
];
