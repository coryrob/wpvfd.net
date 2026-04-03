const body = document.body;
const page = body.dataset.page;
const navLinks = document.querySelector(".nav-links");
const toggle = document.querySelector(".nav-toggle");

if (navLinks && page) {
  const links = navLinks.querySelectorAll("a[href]");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if ((page === "home" && href === "index.html") || href === `${page}.html`) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}
