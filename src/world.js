// Copyright (C) 2022 Radioactive64

/**
 * World class represents all maps within a world
 */
export class World {
    #maps;

    /**
     * Create new World
     */
    constructor() {
        this.#maps = new Map();
    }

    loadMaps(maps) {
        for (let i in maps) {
            let manager = new MapManager(i);
            manager.load();
            this.#maps.set(i, manager);
        }
    }
}

/**
 * MapManager class represents a single map
 */
export class MapManager {
    #layers;
    #name = 'World';

    /**
     * Create new MapManager
     * @param {string} name Name of map
     */
    constructor(name) {
        this.#layers = [];
        this.#name = name;
    }

    /**
     * Loads map from server
     */
    load() {

    }
}

class Layer {
    #collisions;
    #layer;

    constructor(layer) {
        this.#collisions = new CollisionGrid();
    }

    /**
     * @returns {number} Layer of Layer
     */
    layer() {
        return this.#layer;
    };
}

/**
 * Grid interface representing a 2d grid of numbers
 */
class Grid {
    #grid;
    #width = 0;
    #height = 0;

    /**
     * Create new Grid of width and height
     * @param {number} w Width of grid
     * @param {number} h Height of grid
     */
    constructor(w, h) {
        this.#width = w;
        this.#height = h;
        this.#grid = [];
        for (let y = 0; y < h; y++) {
            this.#grid[y] = [];
            for (let x = 0; x < w; x++) {
                this.#grid[y][x] = 0;
            }
        }
    }

    /**
     * @returns {number} Width of Grid
     */
    width() {
        return this.#width;
    }
    /**
     * @returns {number} Height of Grid
     */
    height() {
        return this.#height;
    }
}

/**
 * CollisionGrid class
 */
class CollisionGrid extends Grid {

    /**
     * Create new CollisionGrid
     * @param {number} w Width of grid
     * @param {number} h Height of grid
     */
    constructor(w, h) {
        super(w, h);
    }
}