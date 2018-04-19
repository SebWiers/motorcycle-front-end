import { Circle, Point } from "./math";

export class Bike {
    constructor() {
    }

    setFrontWheel(p,r){
        this.frontWheel = new Wheel(p,r) 
    }

    setRearWheel(p,r){
        this.rearWheel = new Wheel(p,r) 
    }

    setWheelbase(d){
        this.wheelBase = d
    }

} 