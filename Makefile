.PHONY: test


install:
	npm install

test:
	mocha --compilers coffee:coffee-script
