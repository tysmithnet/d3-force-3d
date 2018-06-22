import { Timer, timer } from "d3-timer";

export default class Simulation {
    public static readonly INITIAL_RADIUS = 10;
    // todo: defaults should have constants
    private numDimensionsBacking:number;
    private alphaBacking = 1;
    private alphaMinBacking = .001;
    private alphaDecayBacking = 1 - Math.pow(this.alphaMinBacking, 1 /300);
    private alphaTargetBacking = 0;
    private velocityDecayBacking = .6;
    private nodesBacking:any; // todo: node datum
    private linksBacking:any; // todo: do we need?
    private forcesBacking:any; // todo: force cache
    private stepperBacking:Timer = timer(this.step);
    private eventBacking:any; // todo: dispatch?
    
    constructor(nodes:any[], numDimensions:number){
        this.numDimensions = numDimensions; // todo: checking/coercion
    }

    public get numDimensions():number {
        return this.numDimensionsBacking;
    }

    public set numDimensions(numDimensions:number) {
        this.numDimensionsBacking = Math.max(Math.min(3, Math.floor(numDimensions)), 0);
    }

    public get alpha():number {
        return this.alphaBacking;
    }

    public set alpha(alpha:number) {
        this.alphaBacking = alpha;
    }

    public get alphaMin():number {
        return this.alphaMinBacking;
    }

    public set alphaMin(alphaMin:number) {
        this.alphaMinBacking = alphaMin;
    }

    public get alphaDecay():number {
        return this.alphaDecayBacking;
    }

    public set alphaDecay(alphaDecay:number) {
        this.alphaDecayBacking = alphaDecay;
    }

    public get alphaTarget():number {
        return this.alphaTargetBacking;
    }

    public set alphaTarget(alphaTarget:number) {
        this.alphaTargetBacking = alphaTarget;
    }

    public get velocityDecay():number {
        return this.velocityDecayBacking;
    }

    public set velocityDecay(velocityDecay:number) {
        this.velocityDecayBacking = velocityDecay;
    }

    public get nodes():any {
        return this.nodesBacking;
    }

    public set nodes(nodes:any) {
        this.nodesBacking = nodes;
    }

    public get links():any {
        return this.linksBacking;
    }

    public set links(links:any) {
        this.linksBacking = links;
    }

    public get forces():any {
        return this.forcesBacking;
    }

    public set forces(forces:any) {
        this.forcesBacking = forces;
    }

    public step():void {
        this.tick();
        if(this.hasFinished()) {
            this.stop();
        }
    }

    public stop():void {
        this.stepperBacking.stop();
        this.eventBacking.call("end", this); // todo: some kind of event emitter
    }

    public tick(): void {
        this.adjustAlpha();
        const numNodes = this.getNumNodes();
        this.forcesBacking.forEach(this.force);
        this.nodesBacking.forEach(this.calculateNodePosition);  
    }

    public restart(): Simulation {
        this.stepperBacking.restart(this.step); 
        // todo: emit event?
        return this;
    }

    private initializeForce(force:any):any {
        if(force.initialize){ // todo: do we need this?
            force.initialize(this.nodesBacking, this.numDimensions);
        }
        return force;
    }

    private findClosest(maxResults:number, radius: number, x:number, y?:number, z?:number):Map<string, any>{
        const set = new Map<string, any>();
        this.nodes.forEach((node, id) => {
            if(set.size > maxResults) {
                return set;
            }
            const dx = x - node.x;
            const dy = y - node.y;
            const dz = z - node.z;
            const dist = Math.sqrt(dx * dx) + (dy * dy) + (dz * dz);
            if(dist <= radius) {
                set.set(id, node);
            }
        });
        return set;
    }

    private calculateNodePosition(node:any): void {
        if(node.fx) {
            node.x = node.fx;
            node.vx = 0;
        }
        else
        {
            node.x += node.vx * this.velocityDecayBacking;
        }
        if(this.numDimensions >= 2) {
            if(node.fy) {
                node.y = node.fy;
                node.vy = 0;
            }
            else
            {
                node.y += node.vy * this.velocityDecayBacking;
            }   
        }
        if(this.numDimensions >= 3) {
            if(node.fz) {
                node.z = node.fz;
                node.vz = 0;
            }
            else
            {
                node.z += node.vz * this.velocityDecayBacking;
            }   
        }
    }

    private force(force:any) {
        ; // todo: 
    }

    private hasFinished():boolean {
        return this.alphaBacking < this.alphaMinBacking; // todo: strategy pattern?
    }

    private getNumNodes():number {
        return 0; // todo: should be able to count array, object, map
    }
    
    private adjustAlpha():void {
        this.alphaBacking += (this.alphaTargetBacking - this.alphaBacking) * this.alphaDecayBacking;
    }
}