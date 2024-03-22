/*
* Code by Isaías Nascimento - isaiasdesign03@gmail.com
* Last update:  20/05/2023
* Jesus loves you ♥
*/

// Util arrow functions
const ec = txt => encodeURIComponent(txt)
const dec = txt => decodeURIComponent(txt)
const gebi = id => document.getElementById(id)
const gebc = c => document.getElementsByClassName(c)
const voltar = gebi("voltar");

const round = (num, places) => {
	if (!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + places)  + "e-" + places);
	} else {
		let arr = ("" + num).split("e");
		let sig = ""
		if (+arr[1] + places > 0) {
			sig = "+";
		}

		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
	}
}

const id = new URL(window.location.href).searchParams.get("id").replace(/useridsearch/gmi,'').trim()


async function getuser() {
	// Fetch API to get the positions and points
	const response = await fetch(`/apiranking?sel=general`)
	const rrr = await response.json()

	const r = rrr.filter(a => a.id == id)
	let rr = r[0]
	if(!rr) return alert("Usuário não encontrado! Contate Isaías Nascimento para mais informações.") 
	rr.total = rr.port + rr.lit + rr.hist + rr.fis + rr.quim + rr.bio + rr.geo + rr.mat;

	gebi("name").innerHTML = rr.name
	gebi("serie").innerHTML = Number(rr.turma) > 3 ? `${Number(rr.turma) - 3}° ano` : `${Number(rr.turma)}° ano`

	function preencherGraficos() {
		const materias = [
			{mat: "port", pont:rr.port, total: 10},
			{mat: "lit", pont:rr.lit, total: 6},
			{mat: "hist", pont:rr.hist, total: 6},
			{mat: "geo", pont:rr.geo, total: 6},
			{mat: "bio", pont:rr.bio, total: 6},
			{mat: "quim", pont:rr.quim, total: 6},
			{mat: "fis", pont:rr.fis, total: 6},
			{mat: "mat", pont:rr.mat, total: 8}
		]

		for(var i = 0; i<materias.length;i++){
			console.log(materias[i].pont + '|' + materias[i].total)
			const medidor = gebi("idg"+materias[i].mat);
  		medidor.style.width = round(materias[i].pont/materias[i].total*100,2) + '%';
  		gebi("pc"+materias[i].mat).innerHTML = round(materias[i].pont/materias[i].total*100,2) + "%";

			gebi("desc"+materias[i].mat).innerHTML = `${materias[i].pont} de ${materias[i].total}`
		}

		const medidortotal = document.getElementById("idgtotal");
  	
		medidortotal.style.width = (rr.total/54)*100 + '%';
  	
		document.getElementById("pctotal").innerHTML = round(((rr.total)/54)*100,2) + '%';
		gebi("desctotal").innerHTML = `${rr.total} de 54`
	}
	
	preencherGraficos()
}

getuser()

voltar.addEventListener('click', function(event){
	window.location.href = '/ranking.html'
})