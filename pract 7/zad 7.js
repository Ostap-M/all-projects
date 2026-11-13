"use strict";

const forms = document.querySelectorAll("form[data-calculator]");

function positiveNumber(form, fieldName, label) {
  const raw = form.elements[fieldName].value.trim();
  const value = Number(raw);
  if (raw === "" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Введи додатне число для поля «${label}».`);
  }
  return value;
}

function isTriangle(a, b, c) {
  return a + b > c && a + c > b && b + c > a;
}

function formatNumber(value) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 8 }).format(value);
}

function integerInput(form, fieldName, label, { allowNegative = false } = {}) {
  const raw = form.elements[fieldName].value.trim();
  const pattern = allowNegative ? /^-?\d+$/ : /^\d+$/;
  if (!pattern.test(raw)) {
    throw new Error(`Введи ціле число для поля «${label}».`);
  }
  return BigInt(raw);
}

function integerSquareRoot(value) {
  if (value < 0n) return null;
  if (value < 2n) return value;
  let estimate = value;
  let next = (estimate + 1n) / 2n;
  while (next < estimate) {
    estimate = next;
    next = (estimate + value / estimate) / 2n;
  }
  return estimate;
}

function isPerfectSquare(value) {
  if (value < 0n) return false;
  const root = integerSquareRoot(value);
  return root * root === value;
}

function calculate(form) {
  const type = form.dataset.calculator;
  if (type === "heron") {
    const a = positiveNumber(form, "a", "сторона a");
    const b = positiveNumber(form, "b", "сторона b");
    const c = positiveNumber(form, "c", "сторона c");
    if (!isTriangle(a, b, c)) throw new Error("Такі довжини не утворюють трикутник.");
    const p = (a + b + c) / 2;
    return `Площа трикутника: ${formatNumber(Math.sqrt(p * (p - a) * (p - b) * (p - c)))} кв. од.`;
  }

  if (type === "sides-angle") {
    const a = positiveNumber(form, "a", "сторона a");
    const b = positiveNumber(form, "b", "сторона b");
    const angle = Number(form.elements.angle.value.trim());
    if (!Number.isFinite(angle) || angle <= 0 || angle >= 180) {
      throw new Error("Кут має бути більшим за 0° і меншим за 180°.");
    }
    const area = (a * b * Math.sin((angle * Math.PI) / 180)) / 2;
    return `Площа трикутника: ${formatNumber(area)} кв. од.`;
  }

  if (type === "base-height") {
    const base = positiveNumber(form, "base", "основа");
    const height = positiveNumber(form, "height", "висота");
    return `Площа трикутника: ${formatNumber((base * height) / 2)} кв. од.`;
  }

  if (type === "circumradius") {
    const a = positiveNumber(form, "a", "сторона a");
    const b = positiveNumber(form, "b", "сторона b");
    const c = positiveNumber(form, "c", "сторона c");
    const radius = positiveNumber(form, "radius", "радіус описаного кола");
    if (!isTriangle(a, b, c)) throw new Error("Такі довжини не утворюють трикутник.");
    return `Площа трикутника: ${formatNumber((a * b * c) / (4 * radius))} кв. од.`;
  }

  if (type === "palindrome") {
    const number = integerInput(form, "number", "число", { allowNegative: true });
    const normalized = number.toString();
    const palindrome = !normalized.startsWith("-") && normalized === [...normalized].reverse().join("");
    return palindrome ? "Це число є паліндромом." : "Це число не є паліндромом.";
  }

  if (type === "anagram") {
    const first = form.elements.first.value.trim().toLocaleLowerCase("uk-UA").replace(/\s+/gu, "").normalize("NFC");
    const second = form.elements.second.value.trim().toLocaleLowerCase("uk-UA").replace(/\s+/gu, "").normalize("NFC");
    if (!first || !second) throw new Error("Введи обидва слова.");
    const sortLetters = (word) => [...word].sort().join("");
    return sortLetters(first) === sortLetters(second) ? "Анаграма." : "Не анаграма.";
  }

  if (type === "fibonacci-index") {
    const raw = form.elements.index.value.trim();
    const index = Number(raw);
    if (!Number.isInteger(index) || index < 1 || index > 10000) {
      throw new Error("Введи цілий порядковий номер від 1 до 10000.");
    }
    let previous = 1n;
    let current = 1n;
    if (index === 1 || index === 2) return `Число Фібоначчі №${index}: 1.`;
    for (let position = 3; position <= index; position += 1) {
      [previous, current] = [current, previous + current];
    }
    return `Число Фібоначчі №${index}: ${current.toString()}.`;
  }

  if (type === "fibonacci-member") {
    const number = integerInput(form, "number", "число");
    const fiveTimesSquare = 5n * number * number;
    const belongs = number > 0n && (isPerfectSquare(fiveTimesSquare + 4n) || isPerfectSquare(fiveTimesSquare - 4n));
    return belongs ? `${number.toString()} належить послідовності Фібоначчі.` : `${number.toString()} не належить послідовності Фібоначчі.`;
  }

  throw new Error("Не вдалося визначити тип калькулятора.");
}

for (const form of forms) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const output = form.querySelector(".result");
    output.classList.remove("success", "error");
    try {
      output.textContent = calculate(form);
      output.classList.add("success");
    } catch (error) {
      output.textContent = error instanceof Error ? error.message : "Сталася помилка.";
      output.classList.add("error");
    }
  });
}
