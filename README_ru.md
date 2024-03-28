# Проект "Хекслет колледж" – CLI прложение для сохранения веб-страниц

**На русском** | [In English](README.md)

### Статус тестов и линтера Hexlet:
[![Actions Status](https://github.com/Vyachowski/backend-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Vyachowski/backend-project-4/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/a626066198bb2e936921/maintainability)](https://codeclimate.com/github/Vyachowski/backend-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a626066198bb2e936921/test_coverage)](https://codeclimate.com/github/Vyachowski/backend-project-4/test_coverage)

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

Вы можете запустить проект с помощью:

```sh
make gendiff [путьКФайлу1] [путьКФайлу2]
```

___

### Демонстрация проекта

#### CLI Gendiff

[![asciicast](https://asciinema.org/a/622629.svg)](https://asciinema.org/a/622629)

#### Показать разницу между JSON в формате по умолчанию

[![asciicast](https://asciinema.org/a/622632.svg)](https://asciinema.org/a/622632)

#### Показать разницу между JSON с параметрами

[![asciicast](https://asciinema.org/a/622633.svg)](https://asciinema.org/a/622633)
