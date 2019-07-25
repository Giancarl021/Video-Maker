const files = require('./files');
const google = require('googleapis').google;
const oAuth2 = google.auth.OAuth2;
const youtube = google.youtube({version: 'v3'});
const express = require('express');
const fs = require('fs');

async function bot() {
    const data = files.load();
    await oAuthAuthenticate();
    const videoInfo = await uploadVideo(data);
    await updateThumbnail(videoInfo);
    // files.save(data);
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
                if (!authCode) reject('> Autorização negada');
                console.log('> Autorização Concedida');
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
            webServer.server.close(() => {
                resolve();
            });
        });
    }

}

async function uploadVideo(data) {
    const videoPath = './data/render.mp4';
    const videoSize = fs.statSync(videoPath).size;
    const videoTitle = `${data.prefix} ${data.searchTerm}`;
    const videoTags = [data.searchTerm, ...data.sentences[0].keywords];
    const videoDescription = data.sentences.map(e => e.text).join('\n\n');

    const requestParams = {
        part: 'snippet, status',
        requestBody: {
            snippet: {
                title: videoTitle,
                description: videoDescription,
                tags: videoTags
            },
            status: {
                privacyStatus: 'unlisted'
            }
        },
        media: {
            body: fs.createReadStream(videoPath)
        }
    };

    const youtubeResponse = await youtube.videos.insert(requestParams, {
        onUploadProgress: uploadProcess
    });

    console.log(`> Vídeo disponível em: https://youtu.be/${youtubeResponse.data.id}`);
    return youtubeResponse.data;

    function uploadProcess(event) {
        const progress = Math.round((event.bytesRead / videoSize));
        console.log(`> Progresso em ${progress}%`);
    }
}

async function updateThumbnail(videoInfo) {
    const thumbnail = {
        videoId: videoInfo.id,
        path: './data/images/thumb.jpg'
    };

    const requestParams = {
        videoId: thumbnail.videoId,
        media: {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(thumbnail.path)
        }
    };

    const youtubeResponse = await youtube.thumbnails.set(requestParams);
    console.log('> Thumbnail exportada');
}

module.exports = bot;
