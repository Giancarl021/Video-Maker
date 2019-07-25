const files = require('./files');
const google = require('googleapis').google;
const express = require('express');
const oAuth2 = google.auth.OAuth2;

async function bot() {
    const data = files.load();
    await oAuthAuthenticate();
    await updateVideo();
    await updateThumbnail();
    files.save(data);
}

async function oAuthAuthenticate() {
    const webServer = await startWebServer();
    const oAuthClient = await createOAuthClient();
    await requestUserConsent(oAuthClient);
    const authorizationToken = await waitGoogleCallback(webServer);
    await requestGoogleAccessTokens(oAuthClient, authorizationToken);
    await setGlobalGoogleAuthentication(oAuthClient);
    await stopWebServer(webServer);

    async function startWebServer() {
        return new Promise((resolve, reject) => {
            const port = 5000;
            const app = express();

            const server = app.listen(port, () => {
                console.log(`> Servidor aguardando resposta em https://localhost:${port}`);
            });

            resolve({
                app,
                server
            })
        });
    }

    async function createOAuthClient() {
        const credentials = require('../credentials/google-youtube');
        return new oAuth2(
            credentials.web.client_id,
            credentials.web.client_secret,
            credentials.web.redirect_uris[0]
        );
    }

    async function requestUserConsent(oAuthClient) {
        const consentUrl = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube']
        });
        console.log(`> Aguardando autorização em ${consentUrl}`);
    }

    async function waitGoogleCallback(webServer) {
        return new Promise((resolve, reject) => {
            webServer.app.get('/oauth2callback', (req, res) => {
                const authCode = req.query.code;
                console.log(`> Autorização dada: ${authCode}`);
                res.send('<h1>Obrigado!</h1><p>Agora feche esta aba</p>');
                resolve(authCode);
            });
        });
    }

    async function requestGoogleAccessTokens(oAuthClient, authorizationToken) {
        return new Promise((resolve, reject) => {
            oAuthClient.getToken(authorizationToken, (err, tokens) => {
                if (err) return reject(err);
                console.log('> Autorização recebida');
                oAuthClient.setCredentials(tokens);
                resolve();
            });
        });
    }

    async function setGlobalGoogleAuthentication(oAuthClient) {
        google.options({
            auth: oAuthClient
        })
    }

    async function stopWebServer(webServer) {
        return new Promise((resolve, reject) => {
            webServer.server.stop(() => {
               resolve();
            });
        });
    }

}

async function updateVideo() {

}

async function updateThumbnail() {

}

module.exports = bot;
