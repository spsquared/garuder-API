// Copyright (C) 2022 Radioactive64

import APIConnection from "./connection.js";

/**
 * `EntityManager` class represents all entities within a world
 */
export class EntityManager {
    #apiConnection
    #players = new Map();
    #monsters = new Map();
    #projectiles = new Map();
    #droppedItems = new Map();

    /**
     * Create a new `EntityManager`
     */
    constructor(apiConnection) {
        if (!(apiConnection instanceof APIConnection)) throw new TypeError('"apiConnection" must be an instance of APIConnection');
        this.#apiConnection = apiConnection;
        // register to update ticks
        this.#apiConnection.registerEntityManager(this);
    }

    /**
     * Runs a tick update from a server-generated pack
     * @param {Array<object>} pack Update pack sent from server - do not run this function!
     */
    update(pack) {
        // update players (remove unupdated players because they no longer exist server-side or are out of render distance)
        this.#updateEntities(this.#players, pack.players, Player);
    }
    /**
     * Runs an update pass on a list of Entities from an incoming pack
     * @param {Map<String, Entity>} map `Map` of Entities to update
     * @param {Array<Object>} pack Incoming pack to update from
     * @param {class} type Subclass of `Entity`
     */
    #updateEntities(map, pack, type) {
        for (let entity of map.values()) {
            entity.updated = false;
        }
        for (let packentity of pack) {
            let entity = pack.get(packentity.id);
            if (entity != undefined) {
                entity.update(packentity);
            } else {
                entity = new type(packentity.id);
                entity.update(packentity);
            }
        }
        for (let entity of map.values()) {
            if (!entity.updated) map.delete(entity.id);
        }
    }

    players() {
        return Array.from(this.#players.values());
    }
    monsters() {
        return Array.from(this.#monsters.values());
    }
    projectiles() {
        return Array.from(this.#projectiles.values());
    }
    items() {
        return Array.from(this.#droppedItems.values());
    }
}

/**
 * 
 */
class Entity {
    #id = '';
    #x = 0;
    #y = 0;
    #map = 'None';
    updated = false;

    constructor(id) {
        this.#id = id;
    }

    update(data) {
        this.#x = data.x;
        this.#y = data.y;
        this.#map = data.map;
        this.updated = true;
    }
}

/**
 * 
 */
export class Player extends Entity {
    constructor(id) {
        super(id);
    }
}