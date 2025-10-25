# Miscellaneous

## Requisitos

* [NodeJS](https://nodejs.org/es)
* [Go](https://go.dev/dl/)
* [Wails](https://wails.io/docs/gettingstarted/installation)

## Instalar dependencias

El front esta hecho con [Vite](https://vite.dev/), asi que hay que instalar dependencias con [NPM](https://www.npmjs.com/).

```bash
cd ./frontend
npm i
```

En el caso de [Go](https://go.dev/dl/), es necesario estar a raiz del directorio del proyecto dentro de la terminal. Y ejecutar lo siguiente:

```bash
go mod tidy
```

## Lanzar el programa

Para esto es necesario tener instalado [Wails](https://wails.io/docs/gettingstarted/installation) para poder usar su [CLI](https://wails.io/docs/reference/cli) y para lanzar el proyecto en modo de desarrolo se usa:

```bash
wails dev
```

## Compilar

Para compilar el proyecto en un archivo ejecutable portable ejecuta:

```bash
wails build
```

El binario lo encontraras en el directorio `build/bin`.

> Para saber más puedes ver la [documentación](https://wails.io/docs/reference/cli#build) de Wails.