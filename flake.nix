{
  inputs = {
    systems.url = "github:nix-systems/default";
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs, systems, }:
    let
      forEachSystem = f:
        nixpkgs.lib.genAttrs (import systems) (system:
          f {
            pkgs = import nixpkgs {
              config.allowUnfree = true;
              inherit system;
            };
          });
    in {
      devShells = forEachSystem ({ pkgs }: {
        default = pkgs.mkShell {

          LC_ALL = "C.UTF-8";

          packages = with pkgs; [
            # languages
            nodejs-22_x
            nodePackages.pnpm

            # misc
            docker
            git
          ];
        };
      });
    };
}