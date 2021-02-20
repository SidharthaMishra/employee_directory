document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    //Vars
    const cardsContainer = document.querySelector(".employees-container");
    const employeeDataURL = "https://randomuser.me/api/?results=12&inc=name,email,city,location,cell,dob,picture&nat=us,gb,ca,fr,au,br,nz,es&noinfo";
    let employees = [];
    const search = document.querySelector("#search-user");
    const modal = document.querySelector(".modal");
    const closeButton = modal.querySelector(".close");

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
                    <div class="card-content">
                        <img src="${e.picture.large}" alt="" class="profile-pic">
                        <div class="info-container">
                            <div class="employee-name">${e.name.first} ${e.name.last}</div>
                            <div class="employee-contact">
                                <p class="email">${e.email}</p>
                                <p class="city">${e.location.city}</p>
                            </div>
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
        .then(() => { displayEmployeeData(employees); });

    search.addEventListener("input", function(e) {
        searchUser(e.target.value);
    });




    function hideModal() {
        let employeeProfile = modal.querySelector(".employee-profile");
        employeeProfile.innerHTML = ` `;
        modal.classList.add("hidden");
    }

    function showModal(e) {
        let employeeProfile = modal.querySelector(".employee-profile");
        const modalContent = `
                        <div class="basic-info">
                            <img src="${e.picture.large}" alt="${e.name.first} ${e.name.last}" class="employee-profile-pic">
                            <div class="employee-info-container">
                                <div class="employee-name">${e.name.first} ${e.name.last}</div>
                                <div class="employee-contact">
                                    <p class="email">${e.email}</p>
                                    <p class="city">${e.location.city}</p>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="detailed-info">
                            <div class="employee-info-container">
                                <div class="employee-cell">${e.cell}</div>
                                <div class="employee-address">
                                    <p class="address">${e.location.street.number} ${e.location.street.name}, ${e.location.city}, ${e.location.state} ${e.location.postcode}</p>
                                    <p class="birthday">Birthday: ${e.dob.date.toString().slice(5,7)}/${e.dob.date.toString().slice(8,10)}/${e.dob.date.toString().slice(0,4)}
                                    </p>
                                </div>
                            </div>
                        </div>
        `;
        employeeProfile.innerHTML = modalContent;
        modal.classList.remove("hidden");
    }

    cardsContainer.addEventListener("click", function(e) {
        let employeeName = null;
        //Obtain the Employee's Name as baseline element
        if (e.target.classList.contains("info-container")) {
            employeeName = e.target.children[0];
        } else if (e.target.classList.contains("employee-name")) {
            employeeName = e.target;
        } else if (e.target.classList.contains("employee-contact")) {
            employeeName = e.target.parentNode.children[0];
        } else if (e.target.classList.contains("email") || e.target.classList.contains("city")) {
            employeeName = e.target.parentNode.parentNode.children[0];
        } else if (e.target.classList.contains("profile-pic")) {
            employeeName = e.target.parentNode.children[1].children[0];
        }
        //Obtain the Card Element that was Clicked and get its index
        let cardClicked = employeeName.parentNode.parentNode.parentNode;
        let cardsContainer = cardClicked.parentNode;
        let cardIndex = Array.from(cardsContainer.children).indexOf(cardClicked);

        showModal(employees[cardIndex]);
    });

    closeButton.addEventListener("click", function() {
        hideModal();
    });

    document.addEventListener("keyup", function(e) {
        if (!modal.classList.contains("hidden") && e.key === 'Escape') {
            hideModal();
        }
    });

});