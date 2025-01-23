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
            nodejs_22
            nodePackages.pnpm

            # tools
            moon
            prisma-engines
            
            # misc
            docker
            git
            openssl
          ];

          env = {
            PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
            PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
            PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
          };
        };
      });
    };
}