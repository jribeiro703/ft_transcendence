import gameVar from "./game/pong/var.js";

// palette de couleurs pour changer de themes dynamiquement
const themes = [
  "whiteTheme",
  "darkTheme",
  "neonBlue",
  "Transcended",
  "darkYellow",
];
let currentThemeIndex = 0;

export function changeTheme(theme) {
  console.log("changeTheme called from color_palette.js");
  const body = document.body;
  if (theme) {
    body.classList.add(theme);
  } else {
    console.log("changeTHeme");
    themes.forEach((theme) => body.classList.remove(theme));

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    body.classList.add(themes[currentThemeIndex]);
    gameVar.currentTheme = themes[currentThemeIndex];
    console.log("theme changed to: ", themes[currentThemeIndex]);

    console.log("change theme currentheme:", gameVar.currentTheme);
  }
}
