// Copyright (C) 2022 Radioactive64

import { io } from 'socket.io-client';
import { webcrypto } from 'node:crypto';
import { World } from './world.js';
import http from 'node:http';

/**
 * Makes a GaruderAPI connection to a server
 */
export default class APIConnection {
    #url;
    #socket;
    #publicKey;
    #loggedIn = false;
    #ready = false;

    /**
     * Create a new `APIConnection`
     * @param {string} url URL of server to connect to
     */
    constructor(url) {
        this.#url = url;

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

        // handle disconnections and polling
        this.#socket.on('disconnect', function() {
            console.error('Disconnected!');
            this.#ready = false;
        });
        this.#socket.on('ping', () => {
            this.#socket.emit('pong');
        });
    }

    // ready and login
    /**
     * Waits until connection is secured
     * @returns {Promise} Promise that resolves when Garuder API connection is established
     */
    async ready() {
        return new Promise((resolve, reject) => {
            let wait = setInterval(() => {
                if (this.#ready) {
                    clearInterval(wait);
                    resolve();
                }
            }, 100);
        });
    }
    /**
     * Login to server
     * @param {string} username Username of login
     * @param {string} password Password of login
     */
    async login(username, password) {
        // login, using RSA key
        if (this.#loggedIn == false && this.#ready) {
            console.log(`Logging in as ${username}...`);
            this.#socket.emit('login', {
                username: username,
                password: await webcrypto.subtle.encrypt({name: 'RSA-OAEP'}, this.#publicKey, new TextEncoder().encode(password))
            });
            // success
            this.#socket.once('loggedIn', () => {
                this.#loggedIn = true;
                console.log('Logged in!');
                this.#socket.off('loginError');
            });
            // failed login
            this.#socket.once('loginError', (err) => {
                console.error(`Login failed: ${err}`);
                this.#socket.off('loggedIn');
            });
        }
    }
    /**
     * Load all maps from server
     * @param {World} world `World` object to load into
     */
    async loadMaps(world) {
        if (!(world instanceof World)) throw new TypeError('"world" must be an instance of World');
        // request all maps
        await new Promise((resolve, reject) => {
            this.#socket.once('mapData', async (maps) => {
                await world.loadMaps(maps, this);
                console.log('Loaded maps!');
            });
            this.#socket.emit('requestMapData');
        });
    }

    /**
     * Load a JSON file from server
     * @param {string} path Path of file
     * @returns {Promise.<object>} `Object` parsed from JSON file
     */
    async requestJSONFile(path) {
        let res = '';
        return new Promise((resolve, reject) => {
            // convert url and path to HTTP URI
            let defaultPort = this.#url.includes('https://') ? 443 : 80;
            let opt = this.#url.replace('http://', '').replace('https://', '').split(':');
            new http.request({
                host: opt[0],
                port: opt[1] ?? defaultPort,
                path: encodeURI(path)
            }, (response) => {
                // return parsed file
                response.on('data', chunk => {res += chunk;});
                response.on('end', () => resolve(JSON.parse(res)));
                response.on('error', reject);
            }).end();
        });
    }
}