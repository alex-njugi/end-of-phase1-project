document.addEventListener("DOMContentLoaded", function () {
    const criminalsContainer = document.getElementById("criminals-container");
    const searchInput = document.getElementById("search");
    const alertButton = document.querySelector(".alert-button");
    const detailsContainer = document.getElementById("details-container");
    const fugitiveName = document.getElementById("fugitive-name");
    const fugitiveImage = document.getElementById("fugitive-image");
    const fugitiveDescription = document.getElementById("fugitive-description");
    const closeButton = document.getElementById("close-details");
    const addForm = document.getElementById("add-fugitive-form");
    const nameInput = document.getElementById("fugitive-name-input");
    const imageInput = document.getElementById("fugitive-image-input");
    const descriptionInput = document.getElementById("fugitive-description-input");

    let fugitivesData = []; // Store fetched data for filtering

    // Fetch fugitives from db.json
    function fetchFugitives() {
        fetch("https://fireland-most-wanted.vercel.app/fugitives")
            .then(response => response.json())
            .then(data => {
                fugitivesData = data;
                displayFugitives(data);
            })
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

        document.querySelectorAll(".view-more").forEach(button => {
            button.addEventListener("click", function () {
                showDetails(this.dataset.id);
            });
        });

        document.querySelectorAll(".delete-criminal").forEach(button => {
            button.addEventListener("click", function () {
                deleteFugitive(this.dataset.id);
            });
        });
    }

    // Search function
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const filteredFugitives = fugitivesData.filter(fugitive =>
            fugitive.name.toLowerCase().includes(query)
        );
        displayFugitives(filteredFugitives);
    });

    // Show fugitive details
    function showDetails(id) {
        fetch(`https://fireland-most-wanted.vercel.app/fugitives/${id}`)
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
        fetch(`https://fireland-most-wanted.vercel.app/fugitives/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchFugitives()); // Refresh list
    }

    // Handle form submission (Newly added function)
    function handleFormSubmit(event) {
        event.preventDefault();

        const newFugitive = {
            name: nameInput.value,
            image: imageInput.value,
            description: descriptionInput.value
        };

        fetch("https://fireland-most-wanted.vercel.app/fugitives", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFugitive)
        })
        .then(response => response.json())
        .then(addedFugitive => {
            fugitivesData.push(addedFugitive); // Update local data
            displayFugitives(fugitivesData); // Update UI without reload
            addForm.reset(); // Clear form
        })
        .catch(error => console.log("Error adding fugitive:", error));
    }

    // Attach event listener to the form
    addForm.addEventListener("submit", handleFormSubmit);

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
