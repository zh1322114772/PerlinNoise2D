import { Vector2DCollection } from "./Vector2DCollection.js";

export class PerlinNoiseGenerator
{ 
    #ctx;
    #renderWidth;
    #renderHeight;
    #octaves
    #octVectors = [];

    constructor(canvas, renderWidth, renderHeight, octaves){
        canvas.width = renderWidth;
        canvas.height = renderHeight;

        this.#ctx = canvas.getContext("2d", {willReadFrequently: true});
        this.#renderHeight = renderHeight;
        this.#renderWidth = renderWidth;
        this.#octaves = Math.max(octaves, 1);


        for (let i = 0; i < this.#octaves; i++)
        { 
            var nums = Math.pow(2, i) + 1;
            this.#octVectors.push(new Vector2DCollection(Math.PI, nums, nums));
        }
    }


    #drawInBuffer(imgArr, delta) { 

        for (let x = 0; x < this.#renderWidth; x++)
        { 
            for (let y = 0; y < this.#renderHeight; y++)
            { 
                this.#drawPixel(imgArr, x, y, 0, 0, 0, 255);
            }
        }


        this.#applyOctave(imgArr, delta, 0, (imgArr, x, y, grad) =>
        { 
                const v = grad * 0.25;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);

        this.#applyOctave(imgArr, delta, 2, (imgArr, x, y, grad) =>
        { 
                const v = grad * 0.25;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);
        
        this.#applyOctave(imgArr, delta, 3, (imgArr, x, y, grad) =>
        { 
                const v = grad  * 0.09;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);
        
        this.#applyOctave(imgArr, delta, 4, (imgArr, x, y, grad) =>
        { 
                const v = grad  * 0.09;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);

        this.#applyOctave(imgArr, delta, 5, (imgArr, x, y, grad) =>
        { 
                const v = grad * 0.09;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);

        this.#applyOctave(imgArr, delta, 6, (imgArr, x, y, grad) =>
        { 
                const v = grad  * 0.09;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);

        this.#applyOctave(imgArr, delta, 7, (imgArr, x, y, grad) =>
        { 
                const v = grad  * 0.09;

                this.#addPixel(imgArr, x, y, v * 256, v * 256, v * 256, 255);
        }, this.#octVectors);
        
    }

    #applyOctave(imgArr, delta, layer, action, layers)
    {
        layers[layer].tick(delta);


        const vectors = layers[layer].getVectors();

        const gapX = this.#renderWidth / Math.pow(2, layer);
        const gapY = this.#renderHeight / Math.pow(2, layer);

        for (let y = 0; y < this.#renderHeight; y++)
        { 
            for (let x = 0; x < this.#renderWidth; x++)
            { 
                const currentBlockX = Math.floor(x / gapX);
                const currentBlockY = Math.floor(y / gapY);

                const u = (x % gapX) / gapX;
                const v = (y % gapY) / gapY;

                const topLeftGradient = this.#dot(u, v, vectors[currentBlockY][currentBlockX].X, vectors[currentBlockY][currentBlockX].Y);
                const topRightGradient = this.#dot(u - 1, v, vectors[currentBlockY][currentBlockX + 1].X, vectors[currentBlockY][currentBlockX + 1].Y);
                const bottomLeftGradient = this.#dot(u, v - 1, vectors[currentBlockY + 1][currentBlockX].X, vectors[currentBlockY + 1][currentBlockX].Y);
                const bottomRightLeftGradient = this.#dot(u - 1, v - 1, vectors[currentBlockY + 1][currentBlockX + 1].X, vectors[currentBlockY + 1][currentBlockX + 1].Y);

                let finalGrad = this.#interpolate(u, v, topLeftGradient, topRightGradient, bottomLeftGradient, bottomRightLeftGradient);

                action(imgArr, x, y, finalGrad);
            }
        }
    }

    #interpolate(x, y, topLeft, topRight, bottomLeft, bottomRight)
    { 
        const x0 = topLeft * this.#nonlinearFun(1 - x) + topRight * this.#nonlinearFun(x);
        const x1 = bottomLeft * this.#nonlinearFun(1 - x) + bottomRight * this.#nonlinearFun(x);
        const final = x0 * this.#nonlinearFun(1 - y) + x1 * this.#nonlinearFun(y);
        return final;
    }

    #nonlinearFun(x)
    { 
        return x;
        //return (6 * Math.pow(x, 5)) - (15 * Math.pow(x, 4)) + (10 * Math.pow(x, 3));
    }

    #dot(vx0, vy0, vx1, vy1)
    { 
        const v0Hyp = Math.pow((vx0 * vx0) + (vy0 * vy0), 0.5);
        const v1Hyp = Math.pow((vx1 * vx1) + (vy1 * vy1), 0.5);

        if (v0Hyp == 0 || v1Hyp == 0)
            return 0;

        return ((vx0/v0Hyp) * (vx1/v1Hyp)) + ((vy0/v0Hyp) * (vy1/v1Hyp));
    }

    #addPixel(imgArr, x, y, r, g, b, a){
        var index = (x + y * this.#renderWidth) * 4;
    
        imgArr.data[index + 0] += r;
        imgArr.data[index + 1] += g;
        imgArr.data[index + 2] += b;
        imgArr.data[index + 3] += a;
    }

    #drawPixel(imgArr, x, y, r, g, b, a){
        var index = (x + y * this.#renderWidth) * 4;
    
        imgArr.data[index + 0] = r;
        imgArr.data[index + 1] = g;
        imgArr.data[index + 2] = b;
        imgArr.data[index + 3] = a;
    }

    renderNextFrame(delta)
    { 
        let imgArr = this.#ctx.getImageData(0, 0, this.#renderWidth, this.#renderHeight);

        this.#drawInBuffer(imgArr, delta);

        this.#ctx.putImageData(imgArr, 0, 0);
    }


}

