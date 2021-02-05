document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    //Vars
    const cardsContainer = document.querySelector(".employees-container");
    const employeeDataURL = "https://randomuser.me/api/?results=12&inc=name,email,city,location,cell,dob,picture&nat=us,gb,ca,fr,au,br,nz,es&noinfo";
    let employees = [];
    const search = document.querySelector("#search-user");

    //Functions
    function getData(url) {
        return fetch(url)
            .then(response => {
                if (response.ok === true) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(new Error("Promise Rejected"));
                }
            })
            .then(response => response.json())
            .catch(err => console.log("Something went wrong", err));
    }

    function generateEmployeeCard(e) {
        let card = `
                <div class="card">
                    <div class="img-container">
                        <img src="${e.picture.large}" alt="" class="profile-pic">
                    </div>
                    <div class="info-container">
                        <div class="employee-name">${e.name.first} ${e.name.last}</div>
                        <div class="employee-contact">
                            <p class="email">${e.email}</p>
                            <p class="city">${e.location.city}</p>
                        </div>
                    </div>
                </div>
           `;

        return card;
    }

    function displayEmployeeData(employees) {

        let employeeCards = employees.reduce((acc, employee) => {
            return acc + generateEmployeeCard(employee);
        }, ``);

        cardsContainer.innerHTML = employeeCards;
    }

    function searchUser(name) {
        const employeeCards = cardsContainer.querySelectorAll(".card");
        if (employeeCards.length > 0) {
            //Convert NodeList=>Array then call forEach
            [...employeeCards].forEach(card => {
                if (!(card.children[1].children[0].innerText.toLowerCase().includes(name.toLowerCase()))) {
                    card.style.display = "none";
                } else {
                    card.style.display = "";
                }
            });
        }
    }

    //---------------//

    getData(employeeDataURL)
        .then(employeesData => employeesData.results
            .forEach(employee => {
                employees.push(employee);
            })
        )
        .then(() => { displayEmployeeData(employees) });

    search.addEventListener("input", function(e) {
        searchUser(e.target.value);
    });

});