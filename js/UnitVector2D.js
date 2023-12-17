export default class UnitVector2D
{ 
    X;
    Y;
    rad;
    
    constructor(rad)
    { 
        this.setDirection(rad);
    }

    setDirection(rad)
    { 
        this.X = Math.cos(rad);
        this.Y = Math.sin(rad);
        this.rad = rad;
    }

    incDirection(delta)
    { 
        this.setDirection(this.rad + delta);
    }
}