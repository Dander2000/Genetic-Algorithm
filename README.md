# AI
## Genetic Algoritm
### of local maximum in Quadratic Function between 0 and 255

`This is Genetic AI that I made on studies.`

## Basics
> It works on command line input and *result.txt* output.
> On input you have to pass 3 numbers that are integers and are assigned to **A B C** in general formula in quadratic function **Ax<sup>2</sup> + Bx + C**.
> On output you will see a 40 results that AI gives as an answer in sequences "**f(x) x**" line by line 40 times.
```
#Basic parameters
 generations:number;
 populations:number;
 crossingChance:number;
 mutationChance:number;
 generation:Array<Genotype>;
```
## Details
> At the begining we generate **populations** times ***Genotypes***.
> ***Genotypes*** are generated in range 0 to 255 and are stored in class where they have their:
- *decimal x value*,
- *decimal quadratic function value*, 
- *8 digit binnary x value* 
- *rullete value* that will be necessary in **select** stage.
> Then we going to loop that is limited by rule  **populations** * **generations** <= 150.
> In loop we **mutate**, **cross**, and then **select** our ***Genotypes***:
* **mutate**:
  > We trying to change any of *bit* in *binnary value* from our ***Genotypes***
* **cross**:
  > We made pair of ***Genotypes*** that will might **cross**, and then we trying to *change the same number of bits in on exact same position* between our pairs
* **select**:
  > Including rullete method, we assign a *rullete value* to ***Genotypes***, basics on their *value of quadratic function* to give a chance of existing to each Genotype in new **generation** array
> After the loop ends we write out our best ***Genotype***, and so 40 times.
