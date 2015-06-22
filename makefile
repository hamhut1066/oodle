.PHONY: all test clean default env

SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)


source_files	:= $(wildcard ts/*.ts)
build_files	:= $(source_files:%.ts=build/%.js)
test_files	:= $(source_files:%.ts=test/build/%.js)
dts_files	:= $(source_files:%.ts=typings/custom/%.js)
doc_files	:=  docs/index.html
app_bundle	:= build docs test/build typings/custom
include_files := build/ts/ranges.js \
								build/ts/engq.js \
								build/ts/calc.js

# Leave this definition at the top
all: dts build test doc

build: dts $(build_files)
	uglifyjs $(include_files) -b -o build/bundle.js --wrap=oodle

dts: $(dts_files)

doc: $(doc_files)
docs: doc

test: $(test_files)
	@uglifyjs $(include_files) -b -o test/build/bundle.js
	@mocha

clean:
	rm -rf $(app_bundle)

env:
	tsd update
	npm install

$(doc_files):
	typedoc --module commonjs --entryPoint oodle --hideGenerator --includeDeclarations --out docs --target ES5 --mode file --name Oodlejs ts

build/%.js: %.ts
	tsc -m commonjs --removeComments --target ES5 --outDir $(dir $@) $<

typings/custom/%.js: %.ts
	tsc -m commonjs -d --removeComments --target ES5 --outDir typings/custom $<

test/build/%.js: %.ts
	tsc --removeComments --target ES5 --outDir $(dir $@) $<
