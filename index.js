// Copyright (C) 2022 Radioactive64

import APISocket from "./src/socket.js";
import { Player } from './src/entity.js';

/**
 * 
 */
export class GuarderAPI {
    socket;

    constructor(url) {
        this.socket = new APISocket(url);
    }

    // login
    login(username, password) {
        this.socket.login(username, password);
    }
}

