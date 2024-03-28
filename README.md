# Hexlet College Project – Web pages saver

**In english** | [По русски](README_ru.md)

### Hexlet tests and linter status:
[![Actions Status](https://github.com/Vyachowski/backend-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Vyachowski/backend-project-4/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/6466423d05eea596cd5d/maintainability)](https://codeclimate.com/github/Vyachowski/backend-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6466423d05eea596cd5d/test_coverage)](https://codeclimate.com/github/Vyachowski/backend-project-4/test_coverage)

![Cover image for project](cover.png)
The project is intended for practicing asynchronous JavaScript and working with promises, writing tests (and, moreover, test-driven development) and parsing web pages.

## Description

Library and cli application for saving a web page with all internal resources.

## Getting Started

### Dependencies

* Node.js
* NPM Package Manager as a part of Node.js

### Installing

* Clone a GitHub repository via

```sh
git clone https://github.com/Vyachowski/backend-project-4.git
```

or

```sh
git clone git@github.com:Vyachowski/backend-project-4.git
```
for ssh
* Run in a root directory of the project
```sh
npm ci
```
* And than execute
```sh
make link
```
to run project via command line easily
* After your work with a project you can perform
```sh
make unlink
```
to uninstall package from the npm global dependencies

### Executing program

You can run the project directly from the command line (if you linked it before):
```sh
page-loader <url> [output dir]
```

or with make command (if you didn't link it):
```sh
make run url=https://example.com dir=/temp/
```

___

### Project demo

#### CLI of Page Loader

[![asciicast](https://asciinema.org/a/622629.svg)](https://asciinema.org/a/622629)
