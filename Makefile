# StackQL `gemini` provider factory.
#
# Run under a POSIX environment (WSL on Windows - the pinned ./stackql
# binary is a Linux ELF). Live targets need GEMINI_API_KEY exported, or an
# `.env` file at the repo root with `export GEMINI_API_KEY=...` (git-ignored).
#
#   make all      - drift check, full pipeline build, guards, tests, docs
#   make build    - convert -> pre-pass -> split -> normalize -> analyze ->
#                   generate -> post-pass -> guards
#   make test     - meta routes walk + mock smoke suite
#   make docs     - docgen (enrich + scrub) + docs-example guard
#
# Publishing (registry PR, Netlify site) is a manual gate - nothing here
# pushes anything anywhere.

SHELL := /bin/bash
ENV_SOURCE := set -a; [ -f .env ] && . ./.env; set +a;

.PHONY: all deps locate pin download convert prepass split normalize analyze \
        generate guards build test test-meta-routes smoke smoke-live docgen \
        check-doc-examples docs website clean

all: locate build test docs

deps:
	npm install

# guard 5: fail when the upstream discovery revision differs from the pin
locate:
	npm run locate

# conscious revision bump: pin upstream, then re-vendor
pin:
	node factory/locate.mjs --pin
	npm run download

download:
	npm run download

convert:
	npm run convert

prepass:
	npm run prepass

split:
	npm run split

normalize:
	npm run normalize

analyze:
	npm run analyze

generate:
	npm run generate

guards:
	npm run guards

build:
	npm run build

test: test-meta-routes smoke

test-meta-routes:
	npm run test-meta-routes

smoke:
	npm run smoke

smoke-live:
	$(ENV_SOURCE) npm run smoke-live

docgen:
	npm run docgen

check-doc-examples:
	npm run check-doc-examples

docs: docgen check-doc-examples

# local docusaurus build (Netlify runs this in CI; not part of `make all`)
website:
	cd website && yarn install && yarn build

clean:
	rm -rf provider-dev/source/split provider-dev/source/gemini-prepassed.yaml \
	       website/build website/.docusaurus
