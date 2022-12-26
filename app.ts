const fs = require('node:fs');
const readline = require('readline');

//Default parameters
let a:number = -1;
let b:number = 80;
let c:number = -1;
const iterations:number = 40;
const rl:any = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.question('A parametr: ', function (aa) {
	rl.question('B parametr: ', function (bb) {
		rl.question('C parametr: ', function (cc) {
			if ( aa != null && aa != "" && aa != undefined ) {
				a = parseInt(aa);
			}
			if ( bb != null && bb != "" && bb != undefined ) {
				b = parseInt(bb);
			}
			if ( cc != null && cc != "" && cc != undefined ) {
				c = parseInt(cc);
			}
			console.log(`calculating value of function ${a}x^2 + ${b}x + ${c}`);
        rl.close();
        });
    });
});
rl.on('close', function () {
	let sum:number = 0;
	let suma:number = 0;
	let odch:Array<number> = [];
	for (let iteration = 0; iteration < iterations; iteration++) {
		const ai:AI = new AI();
		ai.main();
		sum += ai.generation[ai.populations-1].x;
		odch[iteration] = ai.generation[ai.populations-1].x;
	}
	for (let i = 0; i < odch.length; i++) {
		suma += Math.pow(sum/iterations - odch[i],2);
	}
	let odchylenie:number = Math.sqrt(suma/iterations)
	console.log(sum/iterations,odchylenie);							
    console.log('File has been created');
});
const file:any = fs.createWriteStream('./return.txt', { flags: 'w' });
file.close();

class AI {

    private logger:any;
    private generations:number;
    public populations:number;
    private crossingChance:number;
    private mutationChance:number;
    public generation:Array<Genotype>;

    public constructor() {        
        this.generations = 1;
        this.populations = 50;
        this.crossingChance = 985 / 1000;
        this.mutationChance = 55 / 10000;
        this.generation = [];
        this.init();
    }

    public crossing() {
        let genotypeIndexes:Array<number> = [];
        for (let numberOfIndexes = 0; numberOfIndexes < this.populations; numberOfIndexes++) {
            const newIndex:number = Math.floor( Math.random() * this.populations);
            genotypeIndexes.unshift(newIndex);
            let isFirstElementCounted:boolean = false;
            genotypeIndexes.forEach(oldIndex => {
                if (newIndex == oldIndex && isFirstElementCounted) {
                    genotypeIndexes.shift();
                    numberOfIndexes--;
                }
                isFirstElementCounted = true;
            });
        }
        for (let crossingPairIndex:number = 0; crossingPairIndex < (genotypeIndexes.length - 1) / 2; crossingPairIndex++) {
            if (Math.random() < this.crossingChance) {
                let crossPoint:number = Math.floor(Math.random() * 7 + 1);
                let crossedGen1:Genotype;
                let crossedGen2:Genotype;
                crossedGen1 = this.generation[genotypeIndexes[2 * crossingPairIndex]].cross(this.generation[genotypeIndexes[2 * crossingPairIndex + 1]], crossPoint);
                crossedGen2 = this.generation[genotypeIndexes[2 * crossingPairIndex + 1]].cross(this.generation[genotypeIndexes[2 * crossingPairIndex]], crossPoint);
                this.generation[genotypeIndexes[2 * crossingPairIndex + 1]] = crossedGen1;
                this.generation[genotypeIndexes[2 * crossingPairIndex]] = crossedGen2;
            }
        }
    }

    public init() {
        for (let populationCounter = 0; populationCounter < this.populations; populationCounter++) {
            const newGenotype:Genotype = new Genotype(Math.floor(Math.random() * 256));
            this.generation.unshift(newGenotype);
            let isFirstElementCounted:boolean = false;
            this.generation.forEach(oldGenotype => {
                if (newGenotype.value == oldGenotype.value && isFirstElementCounted) {
                    this.generation.shift();
                    populationCounter--;
                }
                isFirstElementCounted = true;
            });
        }
    }

    public main() {
        this.logger = fs.createWriteStream('./return.txt', { flags: 'a' });
		this.generations++;
        while (this.generations * this.populations <= 150) {
            this.mutation();
            this.crossing();
            this.selection();
            this.generations++;
        }
        this.writeGeneration();
        this.logger.close();
    }

    private mutation() {
        for (let mutantNumber:number = 0; mutantNumber < this.populations; mutantNumber++) {
            for (let mutationCell = 0; mutationCell < 8; mutationCell++) {
                if (Math.random() < this.mutationChance) {
                    this.generation[mutantNumber].mutate(mutationCell);
                }
            }
        }
    }

    private selection() {
        this.sort();

        this.generation[0].rullete = Math.abs(this.generation[0].value);
		if (this.generation[0].value < 0) {
			for ( let indexOfGenotype = 1; indexOfGenotype < this.generation.length; indexOfGenotype++ ) {
				this.generation[indexOfGenotype].rullete = this.generation[indexOfGenotype-1].rullete + Math.abs(this.generation[0].value - this.generation[indexOfGenotype].value);
				this.generation[indexOfGenotype].rullete += this.generation[0].rullete;
			}
		} else {
			for ( let indexOfGenotype = 1; indexOfGenotype < this.generation.length; indexOfGenotype++ ) {
				this.generation[indexOfGenotype].rullete = this.generation[indexOfGenotype-1].rullete + Math.abs(this.generation[0].value - this.generation[indexOfGenotype].value);            
			}
		}
        
        let maximum:number = this.generation[ this.generation.length-1 ].rullete;
        let newGen:Array<Genotype> = new Array<Genotype>( this.populations );

        for (let i = 0; i < this.populations; i++) {
            let x:number = Math.round( Math.random() * maximum );
            for ( let j = 0; j  < this.generation.length; j++ ) {
                if(x <= this.generation[j].rullete){
                    if( j == 0 ){
                        newGen[i] = this.generation[j];
                        break;
                    }else if(this.generation[j-1].rullete <= x){
                        newGen[i] = this.generation[j];
                        break;
                    }
                }
            }
        }
        this.generation = [];
        this.generation.push(...newGen);
        this.sort();
    }

    private sort() {
        this.generation.sort((a, b) => {
            return a.value - b.value;
        });
    }

    private writeGeneration() {
		this.logger.write(
			this.generation[this.populations - 1].value + ' '+
			this.generation[this.populations - 1].x + '\n' 
		);
    }

}

class Genotype {

    public x:number;
    public binnaryValue:Array<string>
    public value:number;
    public rullete:number;
    
    public constructor(xNumber:number) {
        this.x = xNumber;
        this.calc()
        this.binnaryValue = [];
        this.toBinary();
    }

    public calc() {
        const x:number = this.x;
        this.value = a * x * x + b * x + c;
    }

    public cross(genotype:Genotype, crossingPoint:number) {
        const newGenotype = new Genotype(0);
        for (let i:number = 0; i < this.binnaryValue.length; i++) {
            newGenotype.binnaryValue[i] = (crossingPoint <= i) ? this.binnaryValue[i] : genotype.binnaryValue[i];
        }
        newGenotype.toDecimal();
        return newGenotype;
    }

    public mutate(mutationCell:number) {
        this.binnaryValue[mutationCell] = (this.binnaryValue[mutationCell] === '0') ? '1' : '0';
        this.toDecimal();
    }

    private toBinary() {
        var startingValue:number = this.x;
        var powerOf2:number = 128;
        this.binnaryValue = [];
        while (powerOf2 >= 1) {
            const v:string = (startingValue - powerOf2 >= 0) ? (() => {
                startingValue -= powerOf2;
                return '1';
            })() : '0'
            this.binnaryValue.push(v);
            powerOf2 /= 2;
        }
    }

    private toDecimal() {
        var startingNumber:number = 0;
        var powerOf2:number = 128;
        this.binnaryValue.forEach(bit => {
            startingNumber += (bit === '1') ? powerOf2 : 0;
            powerOf2 /= 2;
        });
        this.x = startingNumber;
        this.calc();
    }
}

