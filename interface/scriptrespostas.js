/*
* Code by Isaías Nascimento - isaiasdesign03@gmail.com
* Last update:  01/09/2023
* Jesus loves you ♥
*/

// Util arrow functions
const ec = txt => encodeURIComponent(txt)
const dec = txt => decodeURIComponent(txt)
const gebi = id => document.getElementById(id)
const gebc = c => document.getElementsByClassName(c)
const voltar = gebi("voltar")

function toggleview(button){
	this.checked = !this.checked;

	if(!this.checked){
		const el = document.getElementsByClassName("gab")
		for(var i = 0; i < el.length; i++){
			el[reali].style.color = "#000000"
		}
	}else if(this.checked){
		const el = document.getElementsByClassName("gab")
		for(var i = 0; i < el.length; i++){
			el[reli].style.color = "#000000"
		}
	}
}

async function setUser(name, turma, letras){
	const response = await fetch(`/zsetuser?name=${name}&turma=${turma}&letras=${letras}`)
	console.log(`Letras Setuser: ${letras}`)
	const rr = await response
	if(!rr) return false

	return rr
}

const cid = new URL(window.location.href).searchParams.get("id")
if(!cid){
	alert("Erro ao carregar dados. Contate o administrador.")
	window.location.href = '/ranking.html'
}

const id = new URL(window.location.href).searchParams.get("id").replace(/useridsearch/gmi,'').trim()

// Function to generate a table with players rank
async function generate_table() {
	
	const response1 = await fetch(`/apiranking?sel=general`)
	const rrr1 = await response1.json()

	const r1 = rrr1.filter(a => a.id == id)
	let rr1 = r1[0]

	gebi("completename").innerText = rr1.completename
	if(rr1.turma > 3){
		gebi("serie").innerText = rr1.turma - 3 + "º ano";
	}else{
		gebi("serie").innerText = rr1.turma + "º ano";
	}

	const response = await fetch(`/apianswers?serie=${rr1.turma > 3 ? rr1.turma -3 : rr1.turma}`)
	const rr = await response.json()
	let logs = rr[0]
	let alogs = rr[0]
	
	let ans = rr1.letras

	let selected = alogs.answers

	var body = gebi('center')
	var tbl = document.createElement("table");
	tbl.classList.add('tablecenter')
	tbl.id = "tabela"
	tbl.style.align = 'center'
	var tblBody = document.createElement("tbody");
	
	var special = [0, 11, 18, 25, 32, 39, 46, 55]
	var mat = [
		{ materia: "Português", special: 0 },
		{ materia: "Literatura", special: 11 },
		{ materia: "História", special: 18 },
		{ materia: "Geografia", special: 25 },
		{ materia: "Biologia", special: 32 },
		{ materia: "Química", special: 39 },
		{ materia: "Matemática", special: 46 },
		{ materia: "Física", special: 55 }
	];

	function create(){
		var newRow = document.createElement('tr')
		var newCell = document.createElement('td')
		newCell.style.align = 'center'
		var ncText = document.createElement('strong')
		ncText.innerText = 'N°⠀⠀'
		newCell.appendChild(ncText)
		newRow.appendChild(newCell)

		var newCell1 = document.createElement('td')
		var ncText1 = document.createElement('strong')
		ncText1.innerText= 'Gabarito oficial'
		newCell1.appendChild(ncText1)
		newRow.appendChild(newCell1)

		var newCell2 = document.createElement('td')
		var ncText2 = document.createElement('strong')
		ncText2.innerText = 'Resposta aluno(a)'
		newCell2.appendChild(ncText2)
		newRow.appendChild(newCell2)

		var newCell3 = document.createElement('td')
		var ncText3 = document.createElement('strong')
		ncText3.innerText = 'Resultado'
	 newCell3.appendChild(ncText3)
		newRow.appendChild(newCell3)

		/*var newCell3 = document.createElement('td')
		var ncText3 = document.createElement('strong')
		ncText3.innerText = '%'
		newCell3.appendChild(ncText3)
		newRow.appendChild(newCell3)*/

		tblBody.appendChild(newRow)


		for (var i = 0; i < alogs.answers.length + 8; i++) {
			var row = document.createElement("tr");
			var reali = i;
			switch(true) {
					case (i <= 0):
							reali = 0;
							break;
					case (i >= 1 && i <= 10):
							reali = i;
							break;
					case (i >= 11 && i <= 17):
							reali = i - 1;
							break;
					case (i >= 18 && i <= 24):
							reali = i - 2;
							break;
					case (i >= 25 && i <= 31):
							reali = i - 3;
							break;
					case (i >= 32 && i <= 38):
							reali = i - 4;
							break;
					case (i >= 39 && i <= 45):
							reali = i - 5;
							break;
					case (i >= 46 && i <= 54):
							reali = i - 6;
							break;
					case (i >= 55):
							reali = i - 7;
							break;
			}
			console.log(i, reali)

			for (var j = 0; j < 1; j++) {
				var cell = document.createElement("td");
				var cellText = document.createElement('a')
				if (special.includes(i)) {
					var td = document.createElement("td");
					td.setAttribute("colspan", "4"); // Definir o atributo colspan
					cellText.innerText = mat.find(m => m.special == i).materia
					td.appendChild(cellText); // Adicionar o elemento 'a' ao 'td'
					row.appendChild(td); // Adicionar o 'td' à linha
				} else {
						cellText.innerText = reali
						cell.classList.add("num");
						cell.appendChild(cellText);
						row.appendChild(cell);
				}
	
			}
			
			for (var a = 0; a < 1; a++) {
				if(!special.includes(i)){
					var cella = document.createElement("td");
					var cellTexta = document.createElement('a')
					cellTexta.classList.add("gab")
					cellTexta.innerText = selected[reali-1]
					cellTexta.id = `gab${reali-1}`
					cellTexta.style.color = "#000000"


					cella.appendChild(cellTexta);
					cella.classList.add("correct")
					row.appendChild(cella);
				}
			}

			for (var e = 0; e < 1; e++) {
				if(!special.includes(i)){
					var cell1 = document.createElement("td");
					/*var cellText1 = document.createElement('a')*/
					cell1.classList.add("resp")
					let inn = document.createElement("a")
					/*inn.classList.add("num") */
					inn.id = `answeruser${reali-1}`
					inn.innerText = ans[reali-1]
		

					cell1.appendChild(inn)	
				/*cell1.appendChild(cellText1);*/
					row.appendChild(cell1);
				}
			}

			for (var o = 0; o < 1; o++) {
				if(!special.includes(i)){
					var cell2 = document.createElement("td");
					var cellText2 = document.createElement('a')
					cellText2.classList.add("correct")
					cellText2.classList.add("correctcheck")
					cellText2.id = `correct${reali}`
	

					cell2.appendChild(cellText2);
					row.appendChild(cell2);
				}
			}

			tblBody.appendChild(row);
		}

		tbl.appendChild(tblBody);
		body.appendChild(tbl)
	}

	create()

	let nnp = document.createElement('p')
	nnp.innerText = "2024 © Isaías Nascimento • Método"
	nnp.id = "copy"

	body.appendChild(nnp)
}

gebi("recurso").addEventListener('click', function(event){
	window.open("https://forms.gle/APQQWGdSm9AbEt1RA", '_blank')
})
gebi("voltar").addEventListener('click', function(event){
	window.location.href = '/useridsearch?id='+id
})

generate_table().then(e => {
	const alogs = document.querySelectorAll(".num")
	for (var o = 0; o < alogs.length; o++){
		let idd = o+1
		const tselector = gebi(`gab${o}`)
		const ans = gebi(`answeruser${o}`)

		if(tselector.innerText == ans.innerText){
			gebi(`correct${idd}`).innerText = "✔️"
		}else if(tselector.innerText == "X"){
			tselector.innerText = "X"
			tselector.style.color = 'red'
			gebi(`correct${idd}`).innerText = "✔️"
		}else{
			gebi(`correct${idd}`).innerText = "❌"
		}
	}
})
