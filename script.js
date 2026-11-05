/* Biltoo project website — GPL-3.0-or-later */
(() => {
  "use strict";

  const screenshots = {
    gallery: {
      title: "Gallery view",
      src: "assets/gallery.png",
      caption: "Gallery view with packed image layout, filmstrip, and adjustment panel.",
      alt: "Biltoo Gallery showing a collection of images and the filmstrip"
    },
    pdf: {
      title: "PDF pages",
      src: "assets/pdf-gallery.png",
      caption: "A multipage PDF viewed as a gallery of pages.",
      alt: "Biltoo displaying pages of Frankenstein in Gallery view"
    },
    epub: {
      title: "EPUB search",
      src: "assets/epub-find.png",
      caption: "An EPUB document with text search and highlighted results.",
      alt: "Biltoo EPUB view with text search results highlighted"
    },
    workspace: {
      title: "Workspace",
      src: "assets/workspace-crop.png",
      caption: "Multiple images arranged on the workspace with a crop selection active.",
      alt: "Biltoo Workspace with arranged images and a crop selection"
    }
  };

  const order = Object.keys(screenshots);
  const tabs = [...document.querySelectorAll(".shot-tab")];
  const panel = document.getElementById("screenshot-panel");
  const picture = document.getElementById("current-screenshot");
  const caption = document.getElementById("screenshot-caption");
  let selected = "gallery";

  function selectScreenshot(name, focus = false) {
    if (!screenshots[name]) return;
    selected = name;
    const item = screenshots[name];
    picture.src = item.src;
    picture.alt = item.alt;
    caption.textContent = item.caption;
    tabs.forEach(tab => {
      const active = tab.dataset.shot === name;
      tab.classList.toggle("selected", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active) {
        panel.setAttribute("aria-labelledby", tab.id);
        if (focus) tab.focus();
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => selectScreenshot(tab.dataset.shot));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let index = order.indexOf(tab.dataset.shot);
      if (event.key === "ArrowLeft") index = (index + order.length - 1) % order.length;
      if (event.key === "ArrowRight") index = (index + 1) % order.length;
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = order.length - 1;
      selectScreenshot(order[index], true);
    });
  });

  const dialog = document.getElementById("screenshot-dialog");
  const dialogImage = document.getElementById("dialog-image");
  const dialogTitle = document.getElementById("dialog-title");
  function showScreenshot(name) {
    const item = screenshots[name];
    if (!item || typeof dialog.showModal !== "function") return;
    dialogImage.src = item.src;
    dialogImage.alt = item.alt;
    dialogTitle.textContent = item.title;
    dialog.showModal();
  }

  document.getElementById("enlarge-screenshot").addEventListener("click", () => showScreenshot(selected));
  document.querySelectorAll("[data-enlarge]").forEach(button => {
    button.addEventListener("click", () => showScreenshot(button.dataset.enlarge));
  });
  document.querySelectorAll("[data-select-shot]").forEach(button => {
    button.addEventListener("click", () => {
      selectScreenshot(button.dataset.selectShot);
      document.getElementById("screenshots").scrollIntoView({ block: "start" });
    });
  });
  document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
})();
