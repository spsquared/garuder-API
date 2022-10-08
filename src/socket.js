// Copyright (C) 2022 Radioactive64

import { io } from 'socket.io-client';
import { webcrypto } from 'node:crypto';

export default class APISocket {
    socket;
    publicKey;
    loggedIn = false;
    ready = false;

    constructor(url) {
        // connect to server
        console.log('Connecting to ' + url + '...');
        this.socket = io(url, {path: '/guarder-api/'});

        // recieve RSA public key
        this.socket.once('publicKey', async function(key) {
            this.publicKey = await webcrypto.subtle.importKey('jwk', key, {name: "RSA-OAEP", hash: "SHA-256"}, false, ['encrypt']);
            this.ready = true;
            console.log('Connection secured!');
        });
        this.socket.emit('requestPublicKey');
    }

    // login
    async login(username, password) {
        if (!this.loggedIn && this.ready) {
            this.socket.emit('login', {
                username: username,
                password: await webcrypto.subtle.encrypt({name: 'RSA-OAEP'}, this.publicKey, new TextEncoder().encode(password))
            });
            this.loggedIn = true;
        }
    }
}