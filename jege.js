var fs = require('node:fs');
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var a = -1;
var b = 80;
var c = -1;

var ile_wyn = 40;
var ile_os = 50;
var pr_krzyz = 0.96;
var pr_mut = 0.02;

var tablicaPOP = [];

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
			rl.close();
		});
	});
});
rl.on('close', function () {
	for (let i = 0; i < ile_wyn; i++) {
		tworzenieosobnikow()
		for (let lb_pop = 0; lb_pop * ile_os <= 150; lb_pop++) {
			mutacja()
			krzyzowania()
			selekcja()
		}
		zapisywanieNAJsobnika()
	}
});
var file = fs.createWriteStream('./return.txt', { flags: 'w' });
file.close();

function tworzenieosobnikow() {
	tablicaPOP = [];
	for (let osobnik = 0; osobnik < ile_os; osobnik++) {
		let losOSOBA = Math.floor(Math.random() * 256);
		let osoba = {
			wartDOPASO: 0,
			wlasciwosc: losOSOBA,
			wynikFkwadr: 0,
			oblFKkwadr: function () {
				let x = this.wlasciwosc
				this.wynikFkwadr = a * x * x + b * x + c


			}
			, wartoscBinarna: ["0", "0", "0", "0", "0", "0", "0", "0"],
			dziesDObinarne: function () {
				let x = this.wlasciwosc;
				let y = 128;
				for (let binar = 0; binar < this.wartoscBinarna.length; binar++) {
					if (x >= y) {
						this.wartoscBinarna[binar] = "1";
						x -= y;
					}
					else {
						this.wartoscBinarna[binar] = "0";
					}
					y /= 2;
				}
			}
			, binarneDOdzies: function () {
				let xD = this.wartoscBinarna;
				let yD = 128;
				this.wlasciwosc = 0;
				for (let binarD = 0; binarD < this.wartoscBinarna.length; binarD++) {
					if (xD[binarD] == "1") {
						this.wlasciwosc += yD;
					}
					yD /= 2;
				}
			}

		}
		osoba.dziesDObinarne()
		tablicaPOP.unshift(osoba)

	}

}

function krzyzowania() {
	var tablicaINDX = [];
	for (let krzyOSOB = 0; krzyOSOB < ile_os; krzyOSOB++) {
		var kOSOB = Math.floor(Math.random() * ile_os);
		tablicaINDX.unshift(kOSOB)

		for (let kOSdupli = 1; kOSdupli < tablicaINDX.length; kOSdupli++) {
			if (kOSOB == tablicaINDX[kOSdupli]) {
				tablicaINDX.shift()
				krzyOSOB--
				break
			}
		}
	}
	for (let Crossing = 0; Crossing < (ile_os - 1) / 2; Crossing++) {
		if (Math.random() < pr_krzyz) {
			let pseuWART = ["0", "0", "0", "0", "0", "0", "0", "0"]
			let pseuWART2 = ["0", "0", "0", "0", "0", "0", "0", "0"]
			let losoPSEU = Math.floor(Math.random() * 7) + 1


			for (let index = 0; index < 8; index++) {

				if (index < losoPSEU) {
					pseuWART[index] = tablicaPOP[tablicaINDX[Crossing * 2]].wartoscBinarna[index]
					pseuWART2[index] = tablicaPOP[tablicaINDX[Crossing * 2 + 1]].wartoscBinarna[index]

				}

				else {
					pseuWART[index] = tablicaPOP[tablicaINDX[Crossing * 2 + 1]].wartoscBinarna[index]
					pseuWART2[index] = tablicaPOP[tablicaINDX[Crossing * 2]].wartoscBinarna[index]
				}
			}

			tablicaPOP[tablicaINDX[Crossing * 2 + 1]].wartoscBinarna = pseuWART
			tablicaPOP[tablicaINDX[Crossing * 2]].wartoscBinarna = pseuWART2
			tablicaPOP[tablicaINDX[Crossing * 2 + 1]].binarneDOdzies()
			tablicaPOP[tablicaINDX[Crossing * 2]].binarneDOdzies()
		}

	}

}

function mutacja() {
	for (let mutWAbin = 0; mutWAbin < ile_os; mutWAbin++) {
		for (let konkrMIEJbinar = 0; konkrMIEJbinar < 8; konkrMIEJbinar++) {
			if (Math.random() < pr_mut) {
				if (tablicaPOP[mutWAbin].wartoscBinarna[konkrMIEJbinar] == "1") {
					tablicaPOP[mutWAbin].wartoscBinarna[konkrMIEJbinar] = "0"

				}
				else {
					tablicaPOP[mutWAbin].wartoscBinarna[konkrMIEJbinar] = "1"
				}
			}

		}
	}

}

function selekcja() {
	for (let selWA = 0; selWA < ile_os; selWA++) {
		tablicaPOP[selWA].oblFKkwadr();
	}
	tablicaPOP.sort((a, b) => {
		return a.wynikFkwadr - b.wynikFkwadr

	})

	if (tablicaPOP[0].wynikFkwadr < 0) {
		tablicaPOP[0].wartDOPASO = Math.abs(tablicaPOP[0].wynikFkwadr)
	}
	else {
		tablicaPOP[0].wartDOPASO = tablicaPOP[0].wynikFkwadr
	}
	for (let opo = 1; opo < ile_os; opo++) {
		tablicaPOP[opo].wartDOPASO = tablicaPOP[opo - 1].wartDOPASO + Math.abs(tablicaPOP[0].wynikFkwadr - tablicaPOP[opo].wynikFkwadr)
	}
	var tablicaRUL = []
	for (let rulET = 0; rulET < ile_os; rulET++) {
		let RULETKA = Math.floor(Math.random() * tablicaPOP[ile_os - 1].wartDOPASO)
		for (let LOSRUL = 0; LOSRUL < tablicaPOP.length; LOSRUL++) {
			if (RULETKA <= tablicaPOP[LOSRUL].wartDOPASO) {

				if (LOSRUL == 0) {
					tablicaRUL[rulET] = tablicaPOP[LOSRUL]
					break
				} else if (RULETKA >= tablicaPOP[LOSRUL - 1].wartDOPASO) {
					tablicaRUL[rulET] = tablicaPOP[LOSRUL]
					break
				}
			}
		}
	}
	tablicaPOP = []
	for (let i = 0; i < ile_os; i++) {
		tablicaPOP.push(tablicaRUL.shift())

	}
	tablicaPOP.sort((a, b) => {
		return a.wynikFkwadr - b.wynikFkwadr


	})
}

function zapisywanieNAJsobnika() {
	// console.log(
	// 	tablicaPOP[ile_os - 1].wynikFkwadr,
	// 	tablicaPOP[ile_os - 1].wlasciwosc)
	logger = fs.createWriteStream('./return.txt', { flags: 'a' });
	logger.write(
		tablicaPOP[ile_os - 1].wynikFkwadr + ' ' +
		tablicaPOP[ile_os - 1].wlasciwosc + '\n'
	);
	logger.close()
}
