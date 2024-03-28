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
npm link
```
to run project via command line easily
* After your work with a project you can perform
```sh
npm remove -g @hexlet/code
```
to uninstall package from the npm global dependencies

### Executing program

You can run the project with:
```sh
make gendiff [filePath1] [filePath2]
```

___

___

### Project demo

#### CLI of Gendiff

[![asciicast](https://asciinema.org/a/622629.svg)](https://asciinema.org/a/622629)

#### Show difference between JSON in default format

[![asciicast](https://asciinema.org/a/622632.svg)](https://asciinema.org/a/622632)

#### Show difference between JSON with options

[![asciicast](https://asciinema.org/a/622633.svg)](https://asciinema.org/a/622633)
