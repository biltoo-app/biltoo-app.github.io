/* Biltoo project website — GPL-3.0-or-later */
(() => {
  "use strict";

  const viewOrder = ["image", "gallery", "workspace"];
  const viewContent = {
    image: {
      count: "01 / 03",
      title: "Stay in the moment.",
      description: "Move through images and document pages one at a time, with zoom, pan, text search, and the filmstrip close at hand.",
      detail: "Focused image and document reading"
    },
    gallery: {
      count: "02 / 03",
      title: "Everything at a glance.",
      description: "See an entire collection in a packed, scrollable gallery. Find the image or page you're after without stepping through files one by one.",
      detail: "Masonry layouts and a persistent filmstrip"
    },
    workspace: {
      count: "03 / 03",
      title: "Make room for ideas.",
      description: "Arrange several images or pages on one freeform canvas. Compare, crop, and prepare a layout for print or export.",
      detail: "Freeform composition and side-by-side comparison"
    }
  };

  const viewTabs = [...document.querySelectorAll(".view-tab")];
  const viewPanels = [...document.querySelectorAll(".tab-panel")];
  const viewTitle = document.getElementById("view-title");
  const viewDescription = document.getElementById("view-description");
  const viewDetail = document.getElementById("view-detail");
  const viewCount = document.getElementById("view-count");
  let currentView = "gallery";

  function activateView(view, focusTab = false) {
    if (!viewContent[view]) return;
    currentView = view;
    viewTabs.forEach(tab => {
      const selected = tab.dataset.view === view;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    viewPanels.forEach(panel => {
      panel.hidden = panel.id !== `panel-${view}`;
    });
    const content = viewContent[view];
    viewTitle.textContent = content.title;
    viewDescription.textContent = content.description;
    viewDetail.textContent = content.detail;
    viewCount.textContent = content.count;
  }

  function stepView(direction) {
    const index = viewOrder.indexOf(currentView);
    activateView(viewOrder[(index + direction + viewOrder.length) % viewOrder.length]);
  }

  viewTabs.forEach(tab => {
    tab.addEventListener("click", () => activateView(tab.dataset.view));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      let index = viewOrder.indexOf(tab.dataset.view);
      if (event.key === "ArrowRight") index = (index + 1) % viewOrder.length;
      if (event.key === "ArrowLeft") index = (index - 1 + viewOrder.length) % viewOrder.length;
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = viewOrder.length - 1;
      activateView(viewOrder[index], true);
    });
  });
  document.getElementById("previous-view").addEventListener("click", () => stepView(-1));
  document.getElementById("next-view").addEventListener("click", () => stepView(1));

  const installTabs = [...document.querySelectorAll(".install-tab")];
  const installPanels = [...document.querySelectorAll(".install-code")];
  function activateInstall(method, focusTab = false) {
    installTabs.forEach(tab => {
      const selected = tab.dataset.method === method;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    installPanels.forEach(panel => {
      panel.hidden = panel.id !== `install-panel-${method}`;
    });
  }
  installTabs.forEach(tab => {
    tab.addEventListener("click", () => activateInstall(tab.dataset.method));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      activateInstall(tab.dataset.method === "nix" ? "source" : "nix", true);
    });
  });

  const menuToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-navigation");
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    nav.classList.toggle("open", !expanded);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
  }));

  const shots = {
    image: { source: "assets/epub-find.png", title: "Image view — EPUB with text search", alt: "Biltoo image view showing EPUB text search results" },
    gallery: { source: "assets/gallery.png", title: "Gallery view — image collection", alt: "Biltoo gallery view with a mosaic of images" },
    workspace: { source: "assets/workspace-crop.png", title: "Workspace view — arranging and cropping", alt: "Biltoo workspace with multiple pictures and crop tools" },
    pdf: { source: "assets/pdf-gallery.png", title: "Gallery view — PDF pages", alt: "Biltoo PDF gallery showing pages of Frankenstein" }
  };
  const lightbox = document.getElementById("screenshot-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  document.querySelectorAll("[data-lightbox]").forEach(button => {
    button.addEventListener("click", () => {
      const shot = shots[button.dataset.lightbox];
      if (!shot) return;
      lightboxImage.src = shot.source;
      lightboxImage.alt = shot.alt;
      lightboxCaption.textContent = shot.title;
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    });
  });
  document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.close();
  });

  document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const command = button.dataset.copy;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(command);
        } else {
          // Useful for local HTTP previews where the async Clipboard API is restricted.
          const input = document.createElement("textarea");
          input.value = command;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.append(input);
          input.select();
          const copied = document.execCommand("copy");
          input.remove();
          if (!copied) throw new Error("Clipboard access denied");
        }
        button.textContent = "Copied ✓";
      } catch {
        // Browsers outside a secure context cannot access the Clipboard API.
        // The command remains visible and selectable in the adjacent code block.
        button.textContent = "Select command above";
      }
      window.setTimeout(() => { button.textContent = "Copy ⧉"; }, 2200);
    });
  });
})();
