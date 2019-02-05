![catwalk](./src/assets/catwalk.svg)

[![CircleCI](https://circleci.com/gh/qlik-oss/catwalk/tree/master.svg?style=svg)](https://circleci.com/gh/qlik-oss/catwalk/tree/master)

Gain data model insights quickly during its development and validation phases. This tool is useful when you want to explore your data model for whatever reason; maybe you are creating a complex load script, maybe you want to investigate associations.

![screenshot](./images/screenshot.png)

# Usage

For catwalk to work there are two things needed:
1. The UI
2. A Qlik Associative Engine app

## 1. UI
The UI can either be runned locally using
```bash
npm install
npm start
```
Or through the Qlik hosted [catwalk UI](https://catwalk.core.qlik.com)

## 2. Qlik Associative Engine
You need to provide catwalk with a WS-URL (web socket URL) to the app.  

### Example App
For convenience there is an example app and docker-compose.yml in the catwalk repository
```bash
ACCEPT_EULA=yes docker-compose up -d
```
The docker-compose.yml in the repository will expose the Qlik Associative Engine app at:
`ws://localhost:9076/data/drugcases.qvf`

### Qlik Sense Desktop
For connecting to a Qlik Sense Desktop the WS-URL will be:
`ws://localhost:4848/app/<app-name>`

### Qlik Sense Enterprise
The catwalk UI doesn't provide login to the Qlik Sense app but as long as there has been a login to the app in another tab/window the `X-Qlik-Session` cookie is set and catwalk can "reuse" that session. The URL [catwalk.core.qlik.com](https://catwalk.core.qlik.com) has to be white listed in the QMC -> virtual proxy (per virtual proxy being used) for the Sense Proxy to allow sessions from catwalk.

![host white list](./images/qmc-whitelist.png)

### Tip :tada:
In the root of the catwalk repository there is a catwalk.zip which is a Qlik Sense extension that will create a link to the Qlik hosted catwalk UI with the current open app.
