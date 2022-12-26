var fs = require('node:fs');
var readline = require('readline');
//Default parameters
var a = -1;
var b = 80;
var c = -1;
var iterations = 40;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('A parametr: ', function (aa) {
    rl.question('B parametr: ', function (bb) {
        rl.question('C parametr: ', function (cc) {
            if (aa != null && aa != "" && aa != undefined) {
                a = parseInt(aa);
            }
            if (bb != null && bb != "" && bb != undefined) {
                b = parseInt(bb);
            }
            if (cc != null && cc != "" && cc != undefined) {
                c = parseInt(cc);
            }
            console.log("calculating value of function ".concat(a, "x^2 + ").concat(b, "x + ").concat(c));
            rl.close();
        });
    });
});
rl.on('close', function () {
    var sum = 0;
    var suma = 0;
    var odch = [];
    for (var iteration = 0; iteration < iterations; iteration++) {
        var ai = new AI();
        ai.main();
        sum += ai.generation[ai.populations - 1].x;
        odch[iteration] = ai.generation[ai.populations - 1].x;
    }
    for (var i = 0; i < odch.length; i++) {
        suma += Math.pow(sum / iterations - odch[i], 2);
    }
    var odchylenie = Math.sqrt(suma / iterations);
    console.log(sum / iterations, odchylenie);
    console.log('File has been created');
});
var file = fs.createWriteStream('./return.txt', { flags: 'w' });
file.close();
var AI = /** @class */ (function () {
    function AI() {
        this.generations = 1;
        this.populations = 50;
        this.crossingChance = 985 / 1000;
        this.mutationChance = 55 / 10000;
        this.generation = [];
        this.init();
    }
    AI.prototype.crossing = function () {
        var genotypeIndexes = [];
        var _loop_1 = function (numberOfIndexes) {
            var newIndex = Math.floor(Math.random() * this_1.populations);
            genotypeIndexes.unshift(newIndex);
            var isFirstElementCounted = false;
            genotypeIndexes.forEach(function (oldIndex) {
                if (newIndex == oldIndex && isFirstElementCounted) {
                    genotypeIndexes.shift();
                    numberOfIndexes--;
                }
                isFirstElementCounted = true;
            });
            out_numberOfIndexes_1 = numberOfIndexes;
        };
        var this_1 = this, out_numberOfIndexes_1;
        for (var numberOfIndexes = 0; numberOfIndexes < this.populations; numberOfIndexes++) {
            _loop_1(numberOfIndexes);
            numberOfIndexes = out_numberOfIndexes_1;
        }
        for (var crossingPairIndex = 0; crossingPairIndex < (genotypeIndexes.length - 1) / 2; crossingPairIndex++) {
            if (Math.random() < this.crossingChance) {
                var crossPoint = Math.floor(Math.random() * 7 + 1);
                var crossedGen1 = void 0;
                var crossedGen2 = void 0;
                crossedGen1 = this.generation[genotypeIndexes[2 * crossingPairIndex]].cross(this.generation[genotypeIndexes[2 * crossingPairIndex + 1]], crossPoint);
                crossedGen2 = this.generation[genotypeIndexes[2 * crossingPairIndex + 1]].cross(this.generation[genotypeIndexes[2 * crossingPairIndex]], crossPoint);
                this.generation[genotypeIndexes[2 * crossingPairIndex + 1]] = crossedGen1;
                this.generation[genotypeIndexes[2 * crossingPairIndex]] = crossedGen2;
            }
        }
    };
    AI.prototype.init = function () {
        var _this = this;
        var _loop_2 = function (populationCounter) {
            var newGenotype = new Genotype(Math.floor(Math.random() * 256));
            this_2.generation.unshift(newGenotype);
            var isFirstElementCounted = false;
            this_2.generation.forEach(function (oldGenotype) {
                if (newGenotype.value == oldGenotype.value && isFirstElementCounted) {
                    _this.generation.shift();
                    populationCounter--;
                }
                isFirstElementCounted = true;
            });
            out_populationCounter_1 = populationCounter;
        };
        var this_2 = this, out_populationCounter_1;
        for (var populationCounter = 0; populationCounter < this.populations; populationCounter++) {
            _loop_2(populationCounter);
            populationCounter = out_populationCounter_1;
        }
    };
    AI.prototype.main = function () {
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
    };
    AI.prototype.mutation = function () {
        for (var mutantNumber = 0; mutantNumber < this.populations; mutantNumber++) {
            for (var mutationCell = 0; mutationCell < 8; mutationCell++) {
                if (Math.random() < this.mutationChance) {
                    this.generation[mutantNumber].mutate(mutationCell);
                }
            }
        }
    };
    AI.prototype.selection = function () {
        var _a;
        this.sort();
        this.generation[0].rullete = Math.abs(this.generation[0].value);
        if (this.generation[0].value < 0) {
            for (var indexOfGenotype = 1; indexOfGenotype < this.generation.length; indexOfGenotype++) {
                this.generation[indexOfGenotype].rullete = this.generation[indexOfGenotype - 1].rullete + Math.abs(this.generation[0].value - this.generation[indexOfGenotype].value);
                this.generation[indexOfGenotype].rullete += this.generation[0].rullete;
            }
        }
        else {
            for (var indexOfGenotype = 1; indexOfGenotype < this.generation.length; indexOfGenotype++) {
                this.generation[indexOfGenotype].rullete = this.generation[indexOfGenotype - 1].rullete + Math.abs(this.generation[0].value - this.generation[indexOfGenotype].value);
            }
        }
        var maximum = this.generation[this.generation.length - 1].rullete;
        var newGen = new Array(this.populations);
        for (var i = 0; i < this.populations; i++) {
            var x = Math.round(Math.random() * maximum);
            for (var j = 0; j < this.generation.length; j++) {
                if (x <= this.generation[j].rullete) {
                    if (j == 0) {
                        newGen[i] = this.generation[j];
                        break;
                    }
                    else if (this.generation[j - 1].rullete <= x) {
                        newGen[i] = this.generation[j];
                        break;
                    }
                }
            }
        }
        this.generation = [];
        (_a = this.generation).push.apply(_a, newGen);
        this.sort();
    };
    AI.prototype.sort = function () {
        this.generation.sort(function (a, b) {
            return a.value - b.value;
        });
    };
    AI.prototype.writeGeneration = function () {
        this.logger.write(this.generation[this.populations - 1].value + ' ' +
            this.generation[this.populations - 1].x + '\n');
    };
    return AI;
}());
var Genotype = /** @class */ (function () {
    function Genotype(xNumber) {
        this.x = xNumber;
        this.calc();
        this.binnaryValue = [];
        this.toBinary();
    }
    Genotype.prototype.calc = function () {
        var x = this.x;
        this.value = a * x * x + b * x + c;
    };
    Genotype.prototype.cross = function (genotype, crossingPoint) {
        var newGenotype = new Genotype(0);
        for (var i = 0; i < this.binnaryValue.length; i++) {
            newGenotype.binnaryValue[i] = (crossingPoint <= i) ? this.binnaryValue[i] : genotype.binnaryValue[i];
        }
        newGenotype.toDecimal();
        return newGenotype;
    };
    Genotype.prototype.mutate = function (mutationCell) {
        this.binnaryValue[mutationCell] = (this.binnaryValue[mutationCell] === '0') ? '1' : '0';
        this.toDecimal();
    };
    Genotype.prototype.toBinary = function () {
        var startingValue = this.x;
        var powerOf2 = 128;
        this.binnaryValue = [];
        while (powerOf2 >= 1) {
            var v = (startingValue - powerOf2 >= 0) ? (function () {
                startingValue -= powerOf2;
                return '1';
            })() : '0';
            this.binnaryValue.push(v);
            powerOf2 /= 2;
        }
    };
    Genotype.prototype.toDecimal = function () {
        var startingNumber = 0;
        var powerOf2 = 128;
        this.binnaryValue.forEach(function (bit) {
            startingNumber += (bit === '1') ? powerOf2 : 0;
            powerOf2 /= 2;
        });
        this.x = startingNumber;
        this.calc();
    };
    return Genotype;
}());
