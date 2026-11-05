# Biltoo project website

A standalone static website for [Biltoo](https://github.com/Grumbel/biltoo), the Qt image and document viewer for Linux.

The site showcases Biltoo's **Image**, **Gallery**, and **Workspace** modes, document and archive support, non-destructive adjustments, and installation instructions. All application screenshots and the logo are copied from Biltoo's own repository at commit `179a7e87488f5bc16bccc7f5137947e536b1b8c0`.

## Build with Nix

```sh
nix build                 # result/ contains index.html, CSS, JS, and assets
nix build .#website       # same package, explicitly named
nix flake check
```

The static package uses only the website's source files, and requires no network access when served. It supports `x86_64-linux` and `aarch64-linux`.

## Run and preview

```sh
nix run .                         # build, serve on localhost, open a browser
nix run . -- --no-browser         # serve without launching a browser
nix run . -- --port 8000          # request a particular local port
```

The default port is chosen automatically. The preview serves only on `127.0.0.1` and runs until Ctrl+C.

Without Nix, you can also serve the sources directly:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Publish on GitHub Pages

Create a GitHub user or organization whose name matches the desired Pages host—for example, `biltoo-viewer`. Create a repository named `biltoo-viewer.github.io`, push this site's `main` branch, and select **GitHub Actions** as the Pages build and deployment source in the repository settings.

The workflow `.github/workflows/pages.yml` runs `nix flake check` and `nix build .#website`, copies the resulting Nix store output (following the `result` symlink) to a staging directory, and uploads that exact output to GitHub Pages. It runs on pushes to `main` and by manual dispatch. It does not publish the source checkout directly.

There is no hard-coded host or path, so this website also works as a GitHub Pages project site or on another static host.

## Source and licensing

- Site source: `index.html`, `styles.css`, `script.js`.
- `assets/biltoo.svg` and screenshots in `assets/`: taken from [Grumbel/biltoo](https://github.com/Grumbel/biltoo), © 2026 Ingo Ruhnke.
- Biltoo and this website are offered under **GPL-3.0-or-later**; see `LICENSE`.
- The screenshots depict the actual Biltoo application, not a browser demo.

The site's installation commands, features, and format support were checked against Biltoo's README at the source commit above. Optional codecs or capabilities can depend on the application's build-time dependencies.
