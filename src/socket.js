// Copyright (C) 2022 Radioactive64

import { io } from 'socket.io-client';
import { webcrypto } from 'node:crypto';

export default class APISocket {
    #socket;
    #publicKey;
    #loggedIn = false;
    #ready = false;

    constructor(url) {
        // connect to server
        console.log('Connecting to ' + url + '...');
        this.#socket = io(url, {path: '/garuder-api/'});

        // recieve RSA public key
        this.#socket.once('publicKey', async key => {
            this.#publicKey = await webcrypto.subtle.importKey('jwk', key, {name: "RSA-OAEP", hash: "SHA-256"}, false, ['encrypt']);
            this.#ready = true;
            console.log('Connection secured!');
        });
        this.#socket.emit('requestPublicKey');
    }

    // login
    async login(username, password) {
        // login, using RSA key
        if (!this.#loggedIn && this.#ready) {
            this.#socket.emit('login', {
                username: username,
                password: await webcrypto.subtle.encrypt({name: 'RSA-OAEP'}, this.#publicKey, new TextEncoder().encode(password))
            });
            this.#loggedIn = true;
        }
    }

    // loading maps
    async getMaps(mapManager) {
        return new Promise((resolve, reject) => {
            this.#socket.once('mapData', maps => {
                mapManager.loadMaps(maps);
            });
            this.#socket.emit('requestMapData');
        });
    }
}