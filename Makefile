.PHONY: test

TESTS = $(shell find test -type f)


install:
	npm install

test:
	mocha --compilers coffee:coffee-script $(TESTS)
