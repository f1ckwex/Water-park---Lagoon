
const PRICE_ADULT = 1500;  
const PRICE_CHILD = 800;  
const WEEKEND_MARKUP = 0.1;
const MAX_PEOPLE = 50;

const money = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

const form = document.getElementById("calcForm");
const peopleInput = document.getElementById("people");
const kidsInput = document.getElementById("kidsCount");
const kidsBox = document.getElementById("kidsBox");

const rowAdults = document.getElementById("rowAdults");
const rowKids = document.getElementById("rowKids");
const rowMarkup = document.getElementById("rowMarkup");

const textAdults = document.getElementById("textAdults");
const textKids = document.getElementById("textKids");
const sumAdults = document.getElementById("sumAdults");
const sumKids = document.getElementById("sumKids");
const sumMarkup = document.getElementById("sumMarkup");
const warning = document.getElementById("warning");
const totalEl = document.getElementById("total");

document.getElementById("priceAdult").textContent = money.format(PRICE_ADULT);
document.getElementById("priceChild").textContent = money.format(PRICE_CHILD);


function readNumber(input, min, max) {
  const value = parseInt(input.value, 10);

  if (isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function calculate() {
  const people = readNumber(peopleInput, 1, MAX_PEOPLE);
  const isWeekend = form.elements.day.value === "weekend";
  const hasKids = form.elements.kids.value === "yes";

  kidsBox.hidden = !hasKids;

  kidsInput.max = people;
  const kids = hasKids ? readNumber(kidsInput, 1, people) : 0;
  const adults = people - kids;

  rowAdults.hidden = adults === 0;
  rowKids.hidden = kids === 0;
  rowMarkup.hidden = !isWeekend;

  textAdults.textContent = "Взрослые: " + adults + " × " + money.format(PRICE_ADULT);
  sumAdults.textContent = money.format(adults * PRICE_ADULT);

  textKids.textContent = "Дети: " + kids + " × " + money.format(PRICE_CHILD);
  sumKids.textContent = money.format(kids * PRICE_CHILD);

  if (adults < 1) {
    warning.hidden = false;
    totalEl.textContent = "—";
    return;
  }

  warning.hidden = true;

  const subtotal = adults * PRICE_ADULT + kids * PRICE_CHILD;
  const markup = isWeekend ? Math.round(subtotal * WEEKEND_MARKUP) : 0;
  const total = subtotal + markup;

  sumMarkup.textContent = "+" + money.format(markup);
  totalEl.textContent = money.format(total);
}

function fixInputs() {
  const people = readNumber(peopleInput, 1, MAX_PEOPLE);
  peopleInput.value = people;

  if (form.elements.kids.value === "yes") {
    kidsInput.value = readNumber(kidsInput, 1, people);
  }

  calculate();
}

document.querySelectorAll(".stepper__button").forEach(function (button) {
  button.addEventListener("click", function () {
    const input = document.getElementById(button.dataset.target);
    const delta = parseInt(button.dataset.delta, 10);
    const max = parseInt(input.max, 10) || MAX_PEOPLE;

    input.value = Math.min(Math.max((parseInt(input.value, 10) || 0) + delta, 1), max);
    fixInputs();
  });
});

form.addEventListener("input", calculate);
form.addEventListener("change", fixInputs);
form.addEventListener("submit", function (event) {
  event.preventDefault();
});

calculate();



const MAP_COORDS = [43.5855, 39.7231];
const MAP_ADDRESS = "Краснодарский край, г. Сочи, Приморская набережная, 1";

function initMap() {
  const map = new ymaps.Map("yandexMap", {
    center: MAP_COORDS,
    zoom: 15,
    controls: ["zoomControl", "fullscreenControl"]
  });

  const placemark = new ymaps.Placemark(
    MAP_COORDS,
    {
      hintContent: "Не настоящая локация",
      balloonContentHeader: "Аквапарк «Лагуна»",
      balloonContentBody: MAP_ADDRESS + "<br><b>Не настоящая локация</b>"
    },
    {
      preset: "islands#blueDotIcon"
    }
  );

  map.geoObjects.add(placemark);
  map.behaviors.disable("scrollZoom");
}

if (window.ymaps) {
  ymaps.ready(initMap);
} else {
  document.getElementById("yandexMap").innerHTML =
    '<p class="map__fallback">Не удалось загрузить карту. Проверьте API-ключ и интернет.</p>';
}
