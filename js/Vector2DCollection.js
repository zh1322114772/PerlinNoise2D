import UnitVector2D from "./UnitVector2D.js"

export class Vector2DCollection
{ 
    #maxRadianStep
    #vectors

    #numX
    #numY

    constructor(maxRadSteps, x, y)
    { 
        this.#maxRadianStep = maxRadSteps;
        this.#numX = x;
        this.#numY = y;

        let v = [];

        for (let dy = 0; dy < y; dy++)
        { 
            let tempList = [];
            for (let dx = 0; dx < x; dx++)
            { 
                tempList.push(new UnitVector2D(Math.random() * (Math.PI * 2)));
            }
            v.push(tempList);
        }

        this.#vectors = v;
    }

    getVectors()
    { 
        return this.#vectors;
    }


    tick(delta)
    { 
        for (let dy = 0; dy < this.#numY; dy++)
        { 
            for (let dx = 0; dx < this.#numX; dx++)
            { 
                let deltaRad = (Math.random() * this.#maxRadianStep);
                deltaRad *= delta;

                this.#vectors[dy][dx].incDirection(deltaRad);
            }
        }

    }

}