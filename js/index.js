document.addEventListener("DOMContentLoaded", function () {
    const criminalsContainer = document.getElementById("criminals-container");
    const searchInput = document.getElementById("search");
    const alertButton = document.querySelector(".alert-button");
    const detailsContainer = document.getElementById("details-container");
    const fugitiveName = document.getElementById("fugitive-name");
    const fugitiveImage = document.getElementById("fugitive-image");
    const fugitiveDescription = document.getElementById("fugitive-description");
    const closeButton = document.getElementById("close-details");

    // Fetch fugitives from db.json
    function fetchFugitives() {
        fetch("https://phase-1-project-ashen.vercel.app/fugitives")
            .then(response => response.json())
            .then(data => displayFugitives(data))
            .catch(error => console.log("Error fetching data:", error));
    }

    // Show fugitives on the page
    function displayFugitives(fugitives) {
        criminalsContainer.innerHTML = "";

        fugitives.forEach(fugitive => {
            const card = document.createElement("div");
            card.classList.add("criminal-card");

            card.innerHTML = `
                <img src="${fugitive.image}" alt="${fugitive.name}">
                <h2>${fugitive.name}</h2>
                <p>${fugitive.description}</p>
                <button class="view-more" data-id="${fugitive.id}">View More</button>
                <button class="delete-criminal" data-id="${fugitive.id}">Delete</button>
            `;

            criminalsContainer.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll(".view-more").forEach(button => {
            button.addEventListener("click", function () {
                const fugitiveId = this.dataset.id;
                showDetails(fugitiveId);
            });
        });

        document.querySelectorAll(".delete-criminal").forEach(button => {
            button.addEventListener("click", function () {
                const fugitiveId = this.dataset.id;
                deleteFugitive(fugitiveId);
            });
        });
    }

    // Show fugitive details
    function showDetails(id) {
        fetch(`https://phase-1-project-ashen.vercel.app/fugitives/${id}`)
            .then(response => response.json())
            .then(fugitive => {
                fugitiveName.textContent = fugitive.name;
                fugitiveImage.src = fugitive.image;
                fugitiveDescription.textContent = fugitive.description;
                detailsContainer.style.display = "block";
            });
    }

    // Delete fugitive
    function deleteFugitive(id) {
        fetch(`https://phase-1-project-ashen.vercel.app/fugitives/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchFugitives()); // Refresh list
    }

    // Close details
    closeButton.addEventListener("click", function () {
        detailsContainer.style.display = "none";
    });

    // Welcome button alert
    alertButton.addEventListener("click", function () {
        alert("Feel free to report unlawful acts!");
    });

    // Load fugitives when page loads
    fetchFugitives();
});

