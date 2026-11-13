const sourceText = document.querySelector("#source-text");
const convertButton = document.querySelector("#go");
const resultText = document.querySelector("#result-text");

function makeLetter(letter) {
  const image = document.createElement("img");
  const isUppercase = letter !== letter.toLowerCase();
  const fileName = isUppercase
    ? `${letter.toUpperCase()}.png`
    : `small_${letter.toLowerCase()}.png`;

  image.className = "cutout-letter";
  image.src = `./images/${fileName}`;
  image.alt = letter;
  image.draggable = false;
  image.style.transform = `rotate(${Math.round(Math.random() * 14 - 7)}deg)`;
  image.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.className = "literal-character";
    fallback.textContent = letter;
    image.replaceWith(fallback);
  }, { once: true });
  return image;
}

function convertText() {
  const text = sourceText.value;
  const fragment = document.createDocumentFragment();

  for (const character of text) {
    if (/\s/.test(character)) {
      const space = document.createElement("span");
      space.className = "word-space";
      space.setAttribute("aria-hidden", "true");
      fragment.append(space);
    } else if (/^[a-z]$/i.test(character)) {
      fragment.append(makeLetter(character));
    } else {
      const literal = document.createElement("span");
      literal.className = "literal-character";
      literal.textContent = character;
      fragment.append(literal);
    }
  }

  resultText.replaceChildren(fragment);
}

convertButton.addEventListener("click", convertText);
sourceText.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    convertText();
  }
});
