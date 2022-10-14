// Copyright (C) 2022 Radioactive64

export class EntityManager {
    
}

/**
 * 
 */
class Entity {
    #id = '';
    #x = 0;
    #y = 0;
    #map = 'None';

    constructor(id) {
        this.#id = id;
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