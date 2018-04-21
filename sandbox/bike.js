'use strict'

import { Circle, Point } from "./math";

export class Bike {
    constructor() {
        this.neck = {
            bottom: new Point(0,0)
            rake: null
        }
        this.fork = {
            maxTravel: null
            rakeNeckToPivot: null
            rakeLineToPivot: null
            rakeNeckToAxle: null
            rakeLineToAxle: null
            //pivotAngle: null // get only
            pivotLength: null
            pivotRotate: null 
        }
        wheelbase: null
        color: null
    }

    set frontWheel(p,r){ this.frontWheel = new Wheel(p,r) }
    get frontWheel(){ return  this.frontWheel }

    set rearWheel(p,r){ this.rearWheel = new Wheel(p,r) }
    get rearWheel(){ return this.rearWheel }

    set fork.pivotFromNeck(){
        if (this.neck.rake === null || this.fork.rakeNeckToPivot === null || this.fork.rakeLineToPivot) { this.fork.pivotFromNeck = null }
        else { 
            this.fork.pivotFromNeck = {
                dX: Math.sin(this.neck.rake) * this.fork.rakeNeckToPivot + Math.cos(this.neck.rake) * this.fork.rakeLineToPivot 
                dY: Math.cos(this.neck.rake) * this.fork.rakeNeckToPivot + Math.sin(this.neck.rake) * this.fork.rakeLineToPivot 
            }
        }
    }
    get fork.pivotFromNeck(){
        return this.pivotFromNeck
    }

    set fork.axleFromNeck(){
        if (this.neck.rake === null || this.fork.rakeNeckToAxle === null || this.fork.rakeLineToAxle) { this.fork.axleFromNeck = null }
        else { 
            this.fork.axleFromNeck = {
                dX: Math.sin(this.neck.rake) * this.fork.rakeNeckToAxle + Math.cos(this.neck.rake) * this.fork.rakeLineToAxle 
                dY: Math.cos(this.neck.rake) * this.fork.rakeNeckToAxle + Math.sin(this.neck.rake) * this.fork.rakeLineToAxle 
            }
        }
    }
    get fork.axleFromNeck(){
        return this.axleFromNeck
    }

};

export class Wheel extends Circle{
    constructor(p,r){
        super(p,r)
        this.color = null
    }
}