const galleryGrid = document.querySelector("#gallery-grid");
const albumGrid = document.querySelector("#album-grid");
const filterHost = document.querySelector("#gallery-filters");
const emptyState = document.querySelector("#gallery-empty");
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxAlbum = document.querySelector("#lightbox-album");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxDescription = document.querySelector("#lightbox-description");
const lightboxClose = document.querySelector("#lightbox-close");

if (document.body.dataset.page === "gallery" && galleryGrid && filterHost && albumGrid) {
  const items = Array.isArray(window.galleryData) ? window.galleryData : [];
  const categories = ["All", ...new Set(items.map((item) => item.category))];
  let activeCategory = "All";

  const uniqueAlbums = [...new Set(items.map((item) => item.album))];

  const renderFilters = () => {
    filterHost.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-chip${category === activeCategory ? " is-active" : ""}`;
      button.textContent = category;
      button.addEventListener("click", () => {
        activeCategory = category;
        renderFilters();
        renderGallery();
      });
      filterHost.appendChild(button);
    });
  };

  const openLightbox = (item) => {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription || !lightboxAlbum) {
      return;
    }

    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxAlbum.textContent = item.album;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    lightbox.showModal();
  };

  const renderAlbums = () => {
    albumGrid.innerHTML = "";

    uniqueAlbums.forEach((albumName, index) => {
      const count = items.filter((item) => item.album === albumName).length;
      const card = document.createElement("article");
      card.className = `album-card reveal${index === 1 ? " reveal-delay" : index > 1 ? " reveal-delay-2" : ""}`;
      card.innerHTML = `
        <p class="card-label">${albumName}</p>
        <h3>${count} photo${count === 1 ? "" : "s"}</h3>
        <p>${albumName} images collected for the department gallery.</p>
      `;
      albumGrid.appendChild(card);
    });
  };

  const renderGallery = () => {
    galleryGrid.innerHTML = "";

    const visibleItems = activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

    emptyState.hidden = visibleItems.length > 0;

    visibleItems.forEach((item, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `gallery-card reveal${index % 3 === 1 ? " reveal-delay" : index % 3 === 2 ? " reveal-delay-2" : ""}`;
      card.innerHTML = `
        <span class="gallery-card-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </span>
        <span class="gallery-card-copy">
          <span class="gallery-card-meta">${item.category} / ${item.album}</span>
          <strong>${item.title}</strong>
          <span>${item.description}</span>
        </span>
      `;
      card.addEventListener("click", () => openLightbox(item));
      galleryGrid.appendChild(card);
    });
  };

  renderFilters();
  renderAlbums();
  renderGallery();
}

if (lightbox && lightboxClose) {
  lightboxClose.addEventListener("click", () => {
    lightbox.close();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}
