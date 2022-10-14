// Copyright (C) 2022 Radioactive64

import APIConnection from "./src/connection.js";
import { Player } from './src/entity.js';
import { World } from "./src/world.js";

/**
 * `GaruderAPI` class allows interfacing between a server that supports the Garuder API
 */
export class GaruderBot {
    #url;
    #apiConnection;
    maps;

    /**
     * Connect to the Garuder API of a supported game
     * @param {string} url URL of server (e.g. "https://www.garudergame.com/")
     */
    constructor(url) {
        this.#url = url;
        this.#apiConnection = new APIConnection(this.#url);
        this.maps = new World(this.#apiConnection);
        this.#apiConnection.loadMaps(this.maps);
    }

    // ready and login
    /**
     * Waits until connection is secured
     * @returns {Promise} Promise that resolves when Garuder API connection is established
     */
    ready() {
        return this.#apiConnection.ready();
    }
    /**
     * Login to the game
     * @param {string} username Username of bot
     * @param {string} password Password of bot
     */
    login(username, password) {
        this.#apiConnection.login(username, password);
    }
}