"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const search = document.querySelector(".search");

///////////////////////////////////////

// function for rendering the country ---here classname paramneter is for neighbour country styling and for the 1st country no neighbour class is added
const renderCountry = function (data, className = "") {
  const html = `<article class="country ${className}" >
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} people</p> 

    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
</article>`;

  // here we doing the round off for the population (line 23 + is for converting to num)
  // languages is an array of objects that contain many dat and in tht we need the name property

  //   inserting the country to the html
  countriesContainer.insertAdjacentHTML("beforeend", html);
  // countriesContainer.style.opacity = 1 -------doing this in finalll of promise chain
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  // countriesContainer.style.opacity = 1;
};

// ============HANDLING AJAX CALLS USING THE XMLHTTPREQUEST =========
/*

const getCountryDataAndNeighbour = function (country) {
  // AJAX call country-1
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener("load", function () {
    const [data] = JSON.parse(this.responseText); // parsing the json data to object
    console.log(data);
    // render the country-1
    renderCountry(data);

    // render the neigbour country
    const [neigbour] = data.borders; // here we use optional chaining bcoz there may countries without neighbour

    console.log(neigbour);
    if (!neigbour) return; //do nothing if there is no neighbour

    // here the borders is the code of the country and not the country name so we make call with the code
    // AJAX call country-1
    const request2 = new XMLHttpRequest();
    request2.open("GET", `https://restcountries.com/v2/alpha/${neigbour}`);
    request2.send();

    request2.addEventListener("load", function () {
      const data2 = JSON.parse(this.responseText); // parsing the json data to object
      //  here we are not doing destructuring bcoz the parsed response is not array of objects its just come as object
      renderCountry(data2, "neighbour");
    });
  });
};

getCountryDataAndNeighbour("usa");



// =========HANDLING AJAX CALLS USING FETCH AND PROMISES =========

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry(data[0]);
      // here the data is array of objects so we we re passing the full object only using 0 th index
    });
};


*/
// simplified version of  the above getCountryData function

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
        // this will make the promise rejected by manually and call the catch function
      }
      return response.json();
    })
    .then((data) => {
      renderCountry(data[0]);
      console.log(data[0]);
      // neighbour country
      const neighbour = data[0].borders[0];
      console.log("the neihhbours", neighbour);
      if (!neighbour) {
        throw new Error(`No nearby country for ${data[0].name}`);
      } // if no neighbour  return

      // fetch the neighbour country
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response2) => {
      return response2.json();
    })
    .then((data) => {
      renderCountry(data, "neighbour");

      // neighbour country of the neighhbour country
      const neighbour2 = data.borders[0];
      return fetch(`https://restcountries.com/v2/alpha/${neighbour2}`);
    })
    .then((response3) => {
      return response3.json();
    })
    .then((data) => renderCountry(data, "neighbour2"))
    .catch((err) =>
      renderError(`something went wrong buddy ${err.message}...Try Again!`)
    )
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
  // here the data is array of objects so we we re passing the full object only using 0 th index
};

btn.addEventListener("click", function (e) {
  e.preventDefault();
  const country = document.getElementById("country-searchbox").value;
  if (country == "") {
    alert("please enter a country to search");
  } else {
    getCountryData(country);
    search.classList.add("hidden");
  }
});

// creating a new promise

const myPromise = new Promise((resolve, reject) => {
  resolve("Success!"); // or reject("Failure");
})
  .then((result) => console.log(result)) // Runs on success
  .catch((error) => console.error(error)) // Runs on failure
  .finally(() => console.log("Done")); // Runs always

// another promise
const coin = new Promise((success, failiure) => {
  let toss = Math.trunc(Math.random() * 2);
  if (toss == 1) success("its a head");
  else failiure("its a tail");
})
  .then((result) => console.log(result))
  .catch((result) => console.log(result));

//==========async/await====================
// A function that returns a promise
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched!");
    }, 2000); // Simulate a 2-second delay
  });
}

// Async function to use await
async function displayData() {
  console.log("Fetching data...");

  // Await pauses the function until fetchData resolves
  const data = await fetchData();

  console.log(data); // Output: "Data fetched!"
}

displayData();

const text = '{"name":"John", "birth":"1986-12-14", "city":"New York"}';
const obj = JSON.parse(text);
console.log(obj); // Output:
console.log(1 + 2);

// sample api working

fetch(`https://restcountries.com/v2/name/spain`)
  .then((response) => {
    console.log(response);
    if (!response.ok) {
      throw new Error(`Country not found (${response.status})`);
      // this will make the promise rejected by manually and call the catch function
    }
    // console.log(response.json());
    return response.json();
  })
  .then((data) => console.log(data));
const [data1] = data;
console.log(data1);
