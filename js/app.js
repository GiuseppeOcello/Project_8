// === GLobal Variables === //
let employees = [];
const employeesNumber = generateRandomNumber(100, 12);
// URL + Query String as per https://randomuser.me/documentation
const urlquery = `https://randomuser.me/api/?results=${employeesNumber}&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".btn-close");
const modalContainer = document.querySelector(".modal-container");
let currentEmployee = 0;

// === Reusable Functions === //
// Generates a random numbers given the upper and lower limits
function generateRandomNumber (upper, lower = 0) {
   let randomNumber = Math.floor(Math.random() * (upper - lower) ) + lower;
   return randomNumber;
}

// fetch data from API @ https://randomuser.me/api
fetch(urlquery)
.then(response => response.json())
.then(response => response.results)
.then(displayEmployees)
.catch(err => console.log(err));


function displayEmployees(employeeData) {
   employees = employeeData;
   // store the employee HTML as we create it
   let employeeHTML = '';
   // loop through each employee and create the HTML markup
   employees.forEach((employee, index) => {
   let name = employee.name;
   let email = employee.email;
   let city = employee.location.city;
   let picture = employee.picture;
   // Create a card for each emplyee retrieved by fetch
   employeeHTML += `
   <div class="card" data-index="${index}">
   <img class="avatar" src="${picture.large}" />
   <div class="info-container">
   <h2 class="name">${name.first} ${name.last}</h2>
   <p class="email"><a href="mailto:${email}?subject=Hello%20${name.first}">${email}</a></p>
   <p class="address">${city}</p>
   </div>
   </div>
   `
   });
   gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
   currentEmployee = index;
   // Destructuring the object returned by the Fetch request for of access. 
   // Check the original struture here https://randomuser.me/documentation
   let { name, dob, phone, email, location: { city, street, state, postcode
   }, picture } = employees[index];
   // Formatting the date from 1993-07-20T09:44:18.674Z
   let date = new Date(dob.date);
   const modalHTML = `
   <img class="avatar" src="${picture.large}" />
   <div class="text-container">
   <h2 class="name">${name.first} ${name.last}</h2>
   <p class="email"><a href="mailto:${email}?subject=Hello%20${name.first}">${email}</a></p>
   <p class="address">${city}</p>
   <hr />
   <p>${phone}</p>
   <p class="address">${street.number} ${street.name}, ${city}, ${state} ${postcode}</p>
   <p>Birthday:
   ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
   </div>
   `;
   modalContainer.innerHTML = modalHTML;
   overlay.classList.remove("hidden");
   
   }

   

gridContainer.addEventListener('click', e => {
   if (e.target !== gridContainer) {
   // select the card element based on its proximity to actual element clicked
   const card = e.target.closest(".card");
   const index = card.getAttribute('data-index');
   displayModal(index);
   }
   });

btnClose.addEventListener('click', () => {
   overlay.classList.add("hidden");
   });


// === Search Functionality === //

const lookUpValue = document.querySelector("#look-up-value");
const btnSearch = document.querySelector("#btn-search");
const btnReset = document.querySelector("#btn-reset");
let employeeNames = "";
let searchString = "";

btnSearch.addEventListener("click", () => {  
   filterEmployees(lookUpValue.value);
   lookUpValue.value = "";
})

// Filters employees as the user type
lookUpValue.addEventListener('keyup', (e) => {

   // Pushes all the keys entered by the user into an array and removes the last entry if 
   // Backspace is pressed
   if (e.key !== "Backspace") {
      searchString += e.key;
   } else {
      searchString = lookUpValue.value;
   }

   filterEmployees(searchString); 

   if (e.code == "Enter") {
      btnSearch.click()
   }
});


function filterEmployees(lookUp) {
   employeeNames = document.querySelectorAll(".name");
   resultCheck = employeesNumber -1;

   employeeNames.forEach(name => {

      if (!name.innerText.toLowerCase().startsWith(lookUp.toLowerCase()) ) {
         name.parentNode.parentNode.classList.add("hidden");
         resultCheck += -1;
      } else {
         name.parentNode.parentNode.classList.remove("hidden");
         resultCheck += 1;
      }

   });

}

btnReset.addEventListener("click", () => {
   employeeNames.forEach(name => { 
      name.parentNode.parentNode.classList.remove("hidden");
   });
});

// === Modal Navigation === //
const btnPrevious = document.querySelector(".btn-previous");
const btnNext = document.querySelector(".btn-next");

document.addEventListener("keyup", (e) => {
   if (e.code == "ArrowRight") {
      btnNext.click();
   } else if (e.code == "ArrowLeft") {
      btnPrevious.click();
   }
});

btnPrevious.addEventListener("click", () => {
   if (currentEmployee > 0) {
      displayModal(parseInt(currentEmployee) - 1);
   } else if ( currentEmployee == 0) {
      displayModal(employeesNumber - 1);
   } 
 
});

btnNext.addEventListener("click", () => {
   if (currentEmployee < employeesNumber - 1) {
      displayModal(parseInt(currentEmployee) + 1);
   } else if (currentEmployee == employeesNumber - 1) {
      displayModal(0);
   }
   
});
