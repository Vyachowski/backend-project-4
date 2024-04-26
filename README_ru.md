# Проект "Хекслет колледж" – CLI приложение для сохранения веб-страниц

**На русском** | [In English](README.md)

### Статус тестов и линтера Hexlet:
[![Actions Status](https://github.com/Vyachowski/backend-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Vyachowski/backend-project-4/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/6466423d05eea596cd5d/maintainability)](https://codeclimate.com/github/Vyachowski/backend-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6466423d05eea596cd5d/test_coverage)](https://codeclimate.com/github/Vyachowski/backend-project-4/test_coverage)

![Изображение для обложки проекта](cover.png)

Проект предназначен для практики асинхронного JavaScript, работы с промисами, написания тестов (и более того разработки через тестирование) и парсинга веб-страниц.

## Описание

Библиотека и приложение командной строки для сохранения веб-страницы со всеми внутренними ресурсами.

## Начало работы

### Зависимости

* Node.js
* NPM Package Manager входит в состав Node.js

### Установка

* Клонируйте репозиторий GitHub с помощью

```sh
git clone https://github.com/Vyachowski/backend-project-4.git
```

или

```sh
git clone git@github.com:Vyachowski/backend-project-4.git
```
для ssh
* Запустите в корневом каталоге проекта

```sh
npm ci
```

* И затем выполните

```sh
npm link
```

для удобного запуска проекта через командную строку
* После завершения работы с проектом вы можете выполнить

```sh
npm remove -g @hexlet/code
```

для удаления пакета из глобальных зависимостей npm

### Запуск программы

Вы можете запустить проект с помощью из командной строки (если вы выполнили make link):

```sh
page-loader <url> [output dir]
```

Или с помощью make команды (если вы НЕ выполнили make link):

```sh
make run url=https://example.com dir=/temp/
```
___

### Демонстрация проекта

#### CLI Page Loader

[![asciicast](https://asciinema.org/a/622629.svg)](https://asciinema.org/a/622629)
