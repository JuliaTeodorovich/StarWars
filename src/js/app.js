const API_BASE_URL = "https://swapi.dev/api";
const $front = document.querySelector(".front");
const $header2 = document.getElementById("h2");
const $items = document.querySelector(".items");
const $listName = document.querySelector(".list-group-name");
const $links = document.querySelectorAll(".category");
const $cross = document.getElementById("cross");
const $btns = document.querySelector(".btns");
const $btnBack = document.getElementById("btn-back");
const $btnBack2 = document.getElementById("btn-back-from-info");
const $btnNext = document.getElementById("btn-next");
const $loaderBlock = document.querySelector(".load");
const CATEGORY_LINKS = Array.from($links);
let category;
let thisUrl;
let nextUrl;
let previousUrl;

$items.style.display = "none";
$cross.style.display = "none";
$btns.style.display = "none";
$loaderBlock.style.display = "none";

function commonActions() {
  $listName.innerHTML = "";
  $cross.style.display = "none";
  $btns.style.display = "none";
  $loaderBlock.style.display = "flex";
}

function displayCategory(category) {
  $front.style.display = "none";
  $header2.innerHTML = "";
  $items.style.display = "flex";
  const url = `${API_BASE_URL}/${category}/`;
  commonActions();
  fetchData(url);
}

function fetchData(url) {
  axios.get(url).then((res) => {
    $header2.innerHTML = `Choose from ${category}`;
    $cross.style.display = "flex";
    $btns.style.display = "flex";
    $btnBack.style.display = "block";
    $btnBack2.style.display = "none";
    $loaderBlock.style.display = "none";
    for (const result of res.data.results) {
      const $names = document.createElement("a");
      $names.classList.add("list-group-item", "list-group-item-action");
      $listName.appendChild($names);
      $names.innerHTML = result.name;
      $names.addEventListener("click", () => {
        $header2.innerHTML = "";
        $cross.style.display = "none";
        $loaderBlock.style.display = "flex";
        $btnNext.style.display = "none";
        $btnBack.style.display = "none";
        $listName.innerHTML = "";
        $descr = document.createElement("div");
        $descr.classList.add("list-group-item", "list-group-item-action");
        $descr.onmouseover = () => {
          $descr.style.color = "#212529";
          $descr.style.background = "#e6dfcf";
          $descr.style.cursor = "default";
        };
        async function renderInfo() {
          try {
            const name = result.name;
            if (category === "people") {
              const age = result.birth_year;
              const homeworld = await getInfoFromUrl(result.homeworld);
              const vehicles = await getInfoFromUrlArray(result.vehicles);
              const pattern = `", "`;
              $descr.innerHTML = `Name: ${name}<br>Age: ${age}<br>Planet: ${homeworld}<br>${
                vehicles.length === 0
                  ? "No vehicles."
                  : `Vehicles: "${vehicles.join(pattern)}"`
              }`;
            } else if (category === "planets") {
              const climate = result.climate;
              const population = result.population;
              const residents = await getInfoFromUrlArray(result.residents);
              const pattern = ", ";
              $descr.innerHTML = `Name: ${name}<br>Climate: ${climate}<br>Population: ${population}<br>${
                residents.length === 0
                  ? "No residents."
                  : `Residents: ${residents.join(pattern)}`
              }`;
            } else if (category === "vehicles") {
              const vehicleClass = result.vehicle_class;
              const manufacturer = result.manufacturer;
              const pilots = await getInfoFromUrlArray(result.pilots);
              const pattern = ", ";
              $descr.innerHTML = `Name: "${name}"<br>Vehicle class: ${vehicleClass}<br>Manufacturer: "${manufacturer}"<br>${
                pilots.length === 0
                  ? "No pilots."
                  : `Pilots: ${pilots.join(pattern)}`
              }`;
            }
            $header2.innerHTML = `Information`;
            $loaderBlock.style.display = "none";
            $btnBack.style.display = "none";
            $listName.appendChild($descr);
            $cross.style.display = "flex";
            $btnBack2.style.display = "block";
          } catch (error) {
            console.error(error);
          }
        }
        renderInfo();
      });
    }
    thisUrl = url;
    nextUrl = res.data.next;
    previousUrl = res.data.previous;
    $btnNext.style.display = nextUrl ? "block" : "none";
  });
}

for (const link of CATEGORY_LINKS) {
  link.addEventListener("click", () => {
    category = link.textContent.toLowerCase();
    displayCategory(category);
  });
}

$cross.addEventListener("click", () => {
  $front.style.display = "flex";
  $header2.innerHTML = `Choose a category`;
  $items.style.display = "none";
  $cross.style.display = "none";
  $btns.style.display = "none";
});

$btnBack.addEventListener("click", () => {
  if (previousUrl === null) {
    $front.style.display = "flex";
    $header2.innerHTML = `Choose a category`;
    $items.style.display = "none";
    $cross.style.display = "none";
    $btns.style.display = "none";
  } else {
    commonActions();
    fetchData(previousUrl);
  }
});

$btnBack2.addEventListener("click", () => {
  $header2.innerHTML = ``;
  commonActions();
  fetchData(thisUrl);
});

$btnNext.addEventListener("click", () => {
  commonActions();
  fetchData(nextUrl);
});

function getInfoFromUrl(url) {
  return axios.get(url).then((res) => res.data.name);
}

function getInfoFromUrlArray(urlArray) {
  const promises = urlArray.map((url) => {
    return axios.get(url).then((res) => res.data.name);
  });
  return Promise.all(promises);
}
