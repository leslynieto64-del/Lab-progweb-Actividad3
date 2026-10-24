const STORAGE_KEY = "miColeccionPeliculasSeries_v1";
const currentYear = new Date().getFullYear();
const mediaForm = document.querySelector("#media-form");
const titleInput = document.querySelector("#title");
const typeInput = document.querySelector("#type");
const genreInput = document.querySelector("#genre");
const yearInput = document.querySelector("#year");
const statusInput = document.querySelector("#status");
const ratingInput = document.querySelector("#rating");
const editingIdInput = document.querySelector("#editing-id");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");
const formHeading = document.querySelector("#form-heading");
const formMessage = document.querySelector("#form-message");
const titleError = document.querySelector("#title-error");
const typeError = document.querySelector("#type-error");
const genreError = document.querySelector("#genre-error");
const yearError = document.querySelector("#year-error");
const statusError = document.querySelector("#status-error");
const ratingError = document.querySelector("#rating-error");
const mediaList = document.querySelector("#media-list");
const searchInput = document.querySelector("#search");
const typeFilter = document.querySelector("#filter-type");
const statusFilter = document.querySelector("#filter-status");
const genreFilter = document.querySelector("#filter-genre");
const sortBySelect = document.querySelector("#sort-by");
const clearFiltersButton = document.querySelector("#clear-filters-button");
const totalCount = document.querySelector("#total-count");
const pendingCount = document.querySelector("#pending-count");
const finishedCount = document.querySelector("#finished-count");
const resultsCount = document.querySelector("#results-count");
const validTypes = ["pelicula", "serie"];
const validGenres = [
    "Drama", "Acción", "Animación", "Aventura", "Ciencia ficción",
    "Comedia", "Documental", "Fantasía", "Romance", "Suspenso",
    "Terror", "Otro"
];
const validStatuses = ["pendiente", "en-curso", "terminada"];
const validRatings = ["1", "2", "3", "4", "5"];
yearInput.min = "1888";
yearInput.max = String(currentYear);
let mediaItems = loadMediaItems();
function loadMediaItems() {
    try {
        const savedItems = localStorage.getItem(STORAGE_KEY);
        if (!savedItems) {
            return [];
        }
        const parsedItems = JSON.parse(savedItems);
        return Array.isArray(parsedItems) ? parsedItems : [];
    } catch (error) {
        console.error("No fue posible recuperar la colección:", error);
        showFormMessage(
            "No se pudo leer la información guardada en este navegador.",
            true
        );
        return [];
    }
}

function saveMediaItems(itemsToSave = mediaItems) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
        return true;
    } catch (error) {
        console.error("No fue posible guardar la colección:", error);
        return false;
    }
}

function normalizeText(value) {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es");
}

function showFormMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.classList.toggle("error", isError);
}

function clearValidationMessages() {
    const fields = [
        [titleInput, titleError],
        [typeInput, typeError],
        [genreInput, genreError],
        [yearInput, yearError],
        [statusInput, statusError],
        [ratingInput, ratingError]
    ];
    fields.forEach(([input, errorElement]) => {
        errorElement.textContent = "";
        input.removeAttribute("aria-invalid");
    });
}

function validateForm() {
    clearValidationMessages();
    let isValid = true;
    const title = titleInput.value.trim();
    const type = typeInput.value;
    const genre = genreInput.value;
    const yearText = yearInput.value.trim();
    const status = statusInput.value;
    const rating = ratingInput.value;
    function markInvalid(input, errorElement, message) {
        errorElement.textContent = message;
        input.setAttribute("aria-invalid", "true");
        isValid = false;
    }
    if (!title) {
        markInvalid(titleInput, titleError, "Escribe el título.");
    }

    if (!validTypes.includes(type)) {
        markInvalid(typeInput, typeError, "Selecciona película o serie.");
    }

    if (!validGenres.includes(genre)) {
        markInvalid(genreInput, genreError, "Selecciona un género válido.");
    }

    if (!yearText) {
        markInvalid(yearInput, yearError, "Escribe el año de estreno.");
    } else {
        const year = Number(yearText);

        if (!Number.isInteger(year) || year < 1888 || year > currentYear) {
            markInvalid(
                yearInput,
                yearError,
                `Escribe un año entero entre 1888 y ${currentYear}.`
            );
        }
    }
    if (!validStatuses.includes(status)) {
        markInvalid(statusInput, statusError, "Selecciona el estado.");
    }
    if (!validRatings.includes(rating)) {
        markInvalid(ratingInput, ratingError, "Selecciona una valoración del 1 al 5.");
    }
    if (!isValid) {
        showFormMessage("Completa todos los campos obligatorios correctamente.", true);

        const firstInvalid = document.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
            firstInvalid.focus();
        }
    }
    return isValid;
}

// Obtiene los datos del formulario una vez validados.
function getFormData() {
    return {
        title: titleInput.value.trim(),
        type: typeInput.value,
        genre: genreInput.value,
        year: Number(yearInput.value),
        status: statusInput.value,
        rating: Number(ratingInput.value)
    };
}

// Genera un identificador único para cada registro.
function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Registra un título nuevo o actualiza uno existente.
function handleFormSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    const formData = getFormData();
    const editingId = editingIdInput.value;
    const previousItems = mediaItems;
    if (editingId) {
        mediaItems = mediaItems.map((item) => {
            if (item.id === editingId) {
                return {
                    ...item,
                    ...formData,
                    updatedAt: new Date().toISOString()
                };
            }

            return item;
        });
    } else {
        mediaItems = [
            ...mediaItems,
            {
                id: createId(),
                ...formData,
                createdAt: new Date().toISOString()
            }
        ];
    }
    const saved = saveMediaItems();
    if (!saved) {
        mediaItems = previousItems;
        renderApp();
        showFormMessage(
            "No se pudieron guardar los cambios. Revisa el almacenamiento del navegador.",
            true
        );
        return;
    }
    renderApp();
    resetForm(false);
    showFormMessage(
        editingId
            ? "Los cambios se guardaron correctamente."
            : "El título se agregó a tu colección."
    );
}

// Carga los datos de un título en el formulario para editarlo.
function startEditing(id) {
    const item = mediaItems.find((entry) => entry.id === id);
    if (!item) {
        return;
    }
    editingIdInput.value = item.id;
    titleInput.value = item.title || "";
    typeInput.value = item.type || "";
    genreInput.value = item.genre || "";
    yearInput.value = item.year ?? "";
    statusInput.value = item.status || "";
    ratingInput.value = item.rating ?? "";
    formHeading.textContent = "Editar título";
    submitButton.textContent = "Guardar cambios";
    cancelEditButton.hidden = false;
    clearValidationMessages();
    showFormMessage("Estás editando un registro de tu colección.");
    titleInput.focus();
    document.querySelector(".form-panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Cancela la edición y restablece el formulario.
function cancelEditing() {
    resetForm(true);
}
function resetForm(clearMessage = true) {
    mediaForm.reset();
    editingIdInput.value = "";
    formHeading.textContent = "Agregar un título";
    submitButton.textContent = "Agregar a mi lista";
    cancelEditButton.hidden = true;
    clearValidationMessages();
    if (clearMessage) {
        showFormMessage("");
    }
}

// Elimina un título después de pedir confirmación.
function deleteItem(id) {
    const item = mediaItems.find((entry) => entry.id === id);
    if (!item) {
        return;
    }
    const confirmed = window.confirm(
        `¿Quieres eliminar "${item.title}" de tu colección?`
    );
    if (!confirmed) {
        return;
    }
    const previousItems = mediaItems;
    mediaItems = mediaItems.filter((entry) => entry.id !== id);
    const saved = saveMediaItems();
    if (!saved) {
        mediaItems = previousItems;
        renderApp();
        showFormMessage(
            "No se pudo guardar la eliminación. Inténtalo de nuevo.",
            true
        );
        return;
    }
    if (editingIdInput.value === id) {
        resetForm();
    }
    renderApp();
    showFormMessage("El título se eliminó de tu colección.");
}

// Filtra y ordena los títulos según las opciones seleccionadas.
function getFilteredItems() {
    const searchTerm = normalizeText(searchInput.value.trim());
    const filteredItems = mediaItems.filter((item) => {
        const matchesSearch = normalizeText(item.title).includes(searchTerm);
        const matchesType = typeFilter.value === "todos" || item.type === typeFilter.value;
        const matchesStatus = statusFilter.value === "todos" || item.status === statusFilter.value;
        const matchesGenre = genreFilter.value === "todos" || item.genre === genreFilter.value;
        return matchesSearch && matchesType && matchesStatus && matchesGenre;
    });

    const sortMode = sortBySelect.value;
    filteredItems.sort((a, b) => {
        if (sortMode === "title-asc") {
            return a.title.localeCompare(b.title, "es", { sensitivity: "base" });
        }
        if (sortMode === "title-desc") {
            return b.title.localeCompare(a.title, "es", { sensitivity: "base" });
        }
        if (sortMode === "year-desc") {
            return (b.year ?? -1) - (a.year ?? -1);
        }
        if (sortMode === "year-asc") {
            const yearA = a.year ?? Number.MAX_SAFE_INTEGER;
            const yearB = b.year ?? Number.MAX_SAFE_INTEGER;
            return yearA - yearB;
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    return filteredItems;
}

// Actualiza los contadores de la colección.
function updateCounters() {
    totalCount.textContent = mediaItems.length;
    pendingCount.textContent = mediaItems.filter(
        (item) => item.status === "pendiente"
    ).length;
    finishedCount.textContent = mediaItems.filter(
        (item) => item.status === "terminada"
    ).length;
}

// Crea elementos y asigna texto de forma segura.
function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    element.textContent = text;
    return element;
}

function getTypeLabel(type) {
    return type === "serie" ? "Serie" : "Película";
}

function getStatusLabel(status) {
    const statusLabels = {
        pendiente: "Pendiente",
        "en-curso": "En curso",
        terminada: "Vista / Terminada"
    };
    return statusLabels[status] || "Pendiente";
}

// Construye la tarjeta de cada película o serie.
function createMediaCard(item) {
    const card = document.createElement("article");
    card.className = "media-card";
    const topLine = document.createElement("div");
    topLine.className = "card-topline";
    topLine.append(
        createTextElement("span", "type-label", getTypeLabel(item.type)),
        createTextElement("span", `status-label status-${item.status}`, getStatusLabel(item.status))
    );
    const title = createTextElement("h3", "", item.title);
    const details = document.createElement("div");
    details.className = "card-details";
    const detailValues = [item.genre || "Sin género", String(item.year)];
    detailValues.forEach((value, index) => {
        if (index > 0) {
            details.append(createTextElement("span", "detail-separator", "·"));
        }

        details.append(createTextElement("span", "", value));
    });
    card.append(topLine, title, details);
    card.append(
        createTextElement("p", "card-rating", `Valoración personal: ${item.rating} de 5`)
    );
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const editButton = createTextElement("button", "button button-secondary", "Editar");
    editButton.type = "button";
    editButton.addEventListener("click", () => startEditing(item.id));
    const deleteButton = createTextElement("button", "button button-danger", "Eliminar");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => deleteItem(item.id));
    actions.append(editButton, deleteButton);
    card.append(actions);
    return card;
}

// Actualiza la lista sin recargar la página.
function renderMediaList() {
    mediaList.replaceChildren();
    const filteredItems = getFilteredItems();
    const resultLabel = filteredItems.length === 1 ? "resultado" : "resultados";
    resultsCount.textContent = `${filteredItems.length} ${resultLabel}`;
    if (filteredItems.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        const headingText = mediaItems.length === 0
            ? "Tu colección está vacía"
            : "No se encontraron títulos";
        const messageText = mediaItems.length === 0
            ? "Agrega tu primera película o serie con el formulario de arriba."
            : "Prueba con otra búsqueda o cambia los filtros seleccionados.";
        emptyState.append(
            createTextElement("h3", "", headingText),
            createTextElement("p", "", messageText)
        );
        mediaList.append(emptyState);
        return;
    }
    filteredItems.forEach((item) => {
        mediaList.append(createMediaCard(item));
    });
}

function renderApp() {
    updateCounters();
    renderMediaList();
}

// Restablece la búsqueda y los filtros.
function clearFilters() {
    searchInput.value = "";
    typeFilter.value = "todos";
    statusFilter.value = "todos";
    genreFilter.value = "todos";
    sortBySelect.value = "recent";
    renderMediaList();
}

// Eventos principales.
mediaForm.addEventListener("submit", handleFormSubmit);
cancelEditButton.addEventListener("click", cancelEditing);
clearFiltersButton.addEventListener("click", clearFilters);

[searchInput, typeFilter, statusFilter, genreFilter, sortBySelect].forEach((control) => {
    control.addEventListener("input", renderMediaList);
    control.addEventListener("change", renderMediaList);
});

// Actualiza la validación de cada campo mientras se corrige.
titleInput.addEventListener("input", () => {
    if (titleInput.value.trim()) {
        titleError.textContent = "";
        titleInput.removeAttribute("aria-invalid");
    }
});

typeInput.addEventListener("change", () => {
    if (validTypes.includes(typeInput.value)) {
        typeError.textContent = "";
        typeInput.removeAttribute("aria-invalid");
    }
});

genreInput.addEventListener("change", () => {
    if (genreInput.value) {
        genreError.textContent = "";
        genreInput.removeAttribute("aria-invalid");
    }
});

yearInput.addEventListener("input", () => {
    const yearText = yearInput.value.trim();
    const year = Number(yearText);
    if (yearText && Number.isInteger(year) && year >= 1888 && year <= currentYear) {
        yearError.textContent = "";
        yearInput.removeAttribute("aria-invalid");
    }
});

statusInput.addEventListener("change", () => {
    if (validStatuses.includes(statusInput.value)) {
        statusError.textContent = "";
        statusInput.removeAttribute("aria-invalid");
    }
});

ratingInput.addEventListener("change", () => {
    if (validRatings.includes(ratingInput.value)) {
        ratingError.textContent = "";
        ratingInput.removeAttribute("aria-invalid");
    }
});

// Inicializa la interfaz con los datos guardados.
renderApp();
