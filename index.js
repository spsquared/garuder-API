// Copyright (C) 2022 Radioactive64

import APISocket from "./src/socket.js";
import { Player } from './src/entity.js';
import { MapManager } from "./src/world.js";

/**
 * Garuder API class
 */
export class GaruderAPI {
    #socket;
    maps; 

    /**
     * Connect to the Garuder API of a supported game
     * @param {string} url URL of server (e.g. "https://www.garudergame.com/")
     */
    constructor(url) {
        this.#socket = new APISocket(url);
        this.maps = new MapManager();
    }

    // login
    /**
     * Login to the game
     * @param {string} username Username of bot
     * @param {string} password Password of bot
     */
    login(username, password) {
        this.#socket.login(username, password);
    }
}

