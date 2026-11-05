{
  description = "Biltoo project website — static GitHub Pages output and local preview";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems
        (system: f nixpkgs.legacyPackages.${system});
    in
    {
      packages = forAllSystems (pkgs:
        let
          website = pkgs.runCommand "biltoo-website" { } ''
            mkdir -p "$out/assets"
            # Nix store paths have hash-prefixed basenames. Always name the
            # output files explicitly so the website's relative URLs work.
            cp ${./index.html} "$out/index.html"
            cp ${./styles.css} "$out/styles.css"
            cp ${./script.js} "$out/script.js"
            cp -R ${./assets}/. "$out/assets/"
            cp ${./.nojekyll} "$out/.nojekyll"

            test -s "$out/index.html"
            test -s "$out/styles.css"
            test -s "$out/script.js"
            test -f "$out/assets/biltoo.svg"
          '';
        in
        {
          inherit website;
          default = website;
        });

      apps = forAllSystems (pkgs:
        let
          website = self.packages.${pkgs.stdenv.hostPlatform.system}.website;
          serve = pkgs.writeShellApplication {
            name = "biltoo-website-serve";
            runtimeInputs = [ pkgs.python3 pkgs.xdg-utils ];
            text = ''
              exec python3 ${./tools/serve.py} ${website} "$@"
            '';
          };
          app = {
            type = "app";
            program = "${serve}/bin/biltoo-website-serve";
          };
        in
        {
          default = app;
          inherit app;
          serve = app;
        });

      checks = forAllSystems (pkgs: {
        website = self.packages.${pkgs.stdenv.hostPlatform.system}.website;
      });
    };
}
