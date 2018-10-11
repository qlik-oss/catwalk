# core-data-modelling

Gain data model insights quickly during its development and validation phases. This tool is useful when you want to explore your data model for whatever reason; maybe you are creating a complex load script, maybe you want to investigate associations.

![screenshot](./screenshot.png)

**PROTOTYPE — WORK IN PROGRESS**

## Prerequsities

* Node.js v9+
* Docker for Mac/Windows

## Get started

Session app with [drugcases.qvf](./data/drugcases.qvf):

```bash
ACCEPT_EULA=yes/no docker-compose up -d
npm install
npm start
```

You may also attach to an existing engine session (make sure that you have already created a session using the same websocket URL + user):

```bash
ENGINE_URL='ws://localhost:9076/app/' npm start
```
