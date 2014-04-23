.PHONY: test build

TESTS = $(shell find test -type f)


install:
	npm install

test:
	mocha --compilers coffee:coffee-script $(TESTS)

build:
	node build/doc-gen.js > view/patterns.json
