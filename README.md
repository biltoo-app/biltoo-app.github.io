# Biltoo project website

A standalone static website for [Biltoo](https://github.com/Grumbel/biltoo), the Qt image and document viewer for Linux.

The site showcases Biltoo's **Image**, **Gallery**, and **Workspace** modes, document and archive support, non-destructive adjustments, and installation instructions. All application screenshots and the logo are copied from Biltoo's own repository at commit `179a7e87488f5bc16bccc7f5137947e536b1b8c0`.

## Preview locally

No build system, dependencies, or network resources are needed:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Publish on GitHub Pages

Create a GitHub user or organization whose name matches the desired Pages host—for example, `biltoo-viewer`. Create a repository named `biltoo-viewer.github.io`, push this site's `main` branch, and select **Deploy from a branch → main → /(root)** in the repository's Pages settings.

There is no hard-coded host or path, so this website also works as a GitHub Pages project site or on another static host.

## Source and licensing

- Site source: `index.html`, `styles.css`, `script.js`.
- `assets/biltoo.svg` and screenshots in `assets/`: taken from [Grumbel/biltoo](https://github.com/Grumbel/biltoo), © 2026 Ingo Ruhnke.
- Biltoo and this website are offered under **GPL-3.0-or-later**; see `LICENSE`.
- The screenshots depict the actual Biltoo application, not a browser demo.

The site's installation commands, features, and format support were checked against Biltoo's README at the source commit above. Optional codecs or capabilities can depend on the application's build-time dependencies.
