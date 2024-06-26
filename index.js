import axios from 'axios'
import { join, basename, dirname } from "path"
import * as path from 'path'
import { fileURLToPath } from 'url';
const { token } = process.env
import express from 'express'
import cors from 'cors'
const app = express()
import bodyParser from "body-parser"
const __dirname = dirname(fileURLToPath(import.meta.url))
import user from "./database/user.js"
import im from "./db_connect.js"
const ec = txt => encodeURIComponent(txt)
const dec = txt => decodeURIComponent(txt)
const fetch = s => import('node-fetch').then(({default: fetch}) => fetch(s))
im()


function round(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

const headers = /** @type {import("http").OutgoingHttpHeaders} */ ({
		"Access-Control-Allow-Origin": "https://brainly.com.br",
	"Access-Control-Allow-Methods":"GET",
	"Access-Control-Allow-Headers":"X-Api-Token"
})

async function newuser(id, name, turma, answers){
	try {
		const neu = await new user({
			id: id,
			turma: turma,
			name: name.trim(),
			answers: answers,
			registered: new Date().getTime()
		}).save()

		return true

	}catch(error){
		console.log(error)
		return false
	}
}

function ifURL(url){
	try{
		return new URL(url)
	}catch(e){
		return undefined
	}
}

app.use(
	cors({ 
		exposedHeaders: [
			'Authorization'
		]
	}),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	}),
	express.static(path.join(__dirname, '/interface'))
);
				
app.listen(3000, () => {})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/interface'));

// Website pages
app.get('/',function(req,res) {
	console.log("Access: "+ new Date())
  res.sendFile(__dirname + '/interface/ranking.html')
})

app.get('/#',function(req,res) {
	console.log("Access: "+ new Date())
  res.sendFile(__dirname + '/interface/ranking.html')
});


app.get('/ranking',function(req,res) {
	console.log("Access: "+ new Date())
  res.sendFile(__dirname + '/interface/ranking.html')
})

app.get('/check',function(req,res) {
	console.log("Access: "+ new Date())
  res.sendFile(__dirname + '/interface/check.html')
})

app.get('/respostas',function(req,res) {
	console.log("Access: "+ new Date())
	res.sendFile(__dirname + '/interface/respostas.html')
})

app.get('/ranking.html',function(req,res) {
	console.log("Access: "+ new Date())
  res.sendFile(__dirname + '/interface/ranking.html')
})

app.get('/cadastro',function(req,res) {
  res.sendFile(__dirname + '/interface/cadastro.html')
})

app.get('/freq',function(req,res) {
  res.sendFile(__dirname + '/interface/freq.html')
})

app.get('/src',function(req,res) {
	let urlparsed = "https://metodosimulados.yeshayahudesigndeveloper.repl.co" + req._parsedOriginalUrl.href
	let required = new URL(urlparsed).searchParams.get('id') || res.sendStatus(404)
	let format = new URL(urlparsed).searchParams.get('format') || "png"

	
  res.sendFile(__dirname + `/src/${required}.${format}`)
})


app.get('/apianswers',function(req,res) {
	let n = new URL("https://metodosimulados.yeshayahudesigndeveloper.repl.co" + req._parsedOriginalUrl.href).searchParams.get("serie") || null
	if(!n){
		res.sendStatus(404)
	}else{
		let t;
		if (n > 3) t = n - 3
		else t = n
		res.sendFile(__dirname + `/answers${t}.json`)
	}	
})

app.get(/useridsearch/gmi,function(req,res) {
  res.sendFile(__dirname + '/interface/user.html')
})

app.get('/metodocomp.png',function(req,res) {
  res.sendFile(__dirname + '/archives/metodocomp.png')
})

app.get('/metodocompleto.png',function(req,res) {
  res.sendFile(__dirname + '/archives/metodocompleto.png')
})

app.get('/metodobox.png',function(req,res) {
  res.sendFile(__dirname + '/archives/metodobox.png')
})

// Express API 

app.get('/zgetuser', function(req, res){
	let urlparsed = req._parsedOriginalUrl
	const url = new URL('https://gr8acess1.yeshayahudesigndeveloper.repl.co'+ urlparsed.href)
	const id = url.searchParams.get('id')
	const tk = url.searchParams.get('token')

	if(!id) return res.send({success: false, message:'User not found! User wasnt provided.'})
	
	if(!tk || tk !== token) return res.send({success:false, message:'Unauthorized'})

	/*function getUser(username, password){	
		return db.get('users').find(user => user.username == username && user.password == password) || false*/

	user.findOne({id: id}, (err, user) => {
		if(user) res.send(user)
		else res.send({success: false, message:'User not found!'})

	})

	/*console.log(getUser(username, password))
	
  res.sendFile(__dirname + '/zgetuser.js')
	res.send(getUser(username, password))*/
})

app.get('/zsetuser', function(req, res){
	let urlparsed = req._parsedOriginalUrl
	const url = new URL('https://gr8acess1.yeshayahudesigndeveloper.repl.co'+ urlparsed.href)

	function randomid() {
    return Math.random().toString(36).slice(-10);
	}
	
	const id = randomid()
	const name = url.searchParams.get('name')
	const turma = Number(url.searchParams.get('turma'))
	const answers = url.searchParams.get('letras')

	
	user.findOne({ name: name }, (err, user) => {
		if(err)console.log(err)
		if(user){
			console.log(user)
			res.send({success: false, message:'Name already exists!'})
		}else{
			newuser(id, name, turma, answers).then(e=>{
				if(e == true){
					res.send({success:true})
					console.log("ok")
				}else{
					res.send({success:false})
					console.log("not ok")
				}
			})
		}
	})
})


app.get('/apiranking', function(req,res) {
	function sortfunction(a, b){
  	return (a - b)
	}

	let urlparsed = req._parsedOriginalUrl
	const url = new URL('https://gr8acess1.yeshayahudesigndeveloper.repl.co'+ urlparsed.href)
	const sell = Number(url.searchParams.get('sel'))
	const sel = !isNaN(Number(url.searchParams.get('sel'))) ? Number(url.searchParams.get('sel')) : "general"
	
	user.find().then(e => {
		const rrr = e
		let r;
		if(sel > 3){
			r = rrr.filter(us => us.turma == 4 || us.turma == 5 || us.turma == 6)
		}else if(sel == 1 || sel == 2 || sel == 3){
			r = rrr.filter(us => us.turma == sel)
		}else{
			r = rrr.filter(us => us.turma == 1 || us.turma == 2 || us.turma == 3 || us.turma == 4 || us.turma == 5 || us.turma == 6)
		}

		const array = new Array;
		const usersArray = new Array;
		
		for(var t = 0; t < r.length; t++){
			let answers1 = ["B","A","A","A","A","D","D","D","B","E","A","A","B","E","B","C","D","D","A","B","B","B","A","C","E","E","C","C","A","C","B","E","C","A","C","E","A","B","D","C","C","E","D","A","C","B","C","B","C","C","D","D","E","C"]
			let answers2 = ["D","B","A","A","B","E","A","B","A","B","A","E","C","B","D","E","E","B","A","C","C","C","E","E","E","E","E","C","B","C","D","A","E","C","D","C","B","E","A","A","D","E","E","D","D","C","C","B","C","B","C","D","E","E"]
			let answers3 = ["B","A","E","X","B","B","C","C","E","A","C","E","B","E","B","A","B","C","E","E","C","D","D","B","B","C","E","A","C","C","B","E","D","D","E","C","B","E","A","C","B","D","A","D","A","C","E","A","C","A","C","B","B","C"]

			let answersel;
			if(Number(r[t].turma) == 1) answersel = answers1
			if(Number(r[t].turma) == 2) answersel = answers2
			if(Number(r[t].turma) == 3) answersel = answers3
			if(Number(r[t].turma) == 4) answersel = answers1
			if(Number(r[t].turma) == 5) answersel = answers2
			if(Number(r[t].turma) == 6) answersel = answers3

			let arranswers = r[t].answers.split("")

			let pontosPorMateria = {
				port: 0,
				lit: 0,
				mat: 0,
				bio: 0,
				fis: 0,
				quim: 0,
				hist: 0,
				geo: 0
			};
			
			let pontos = 0;
					
			let intervals = {
				port: [1, 10],
				lit: [11, 16],
				hist: [17, 22],
				geo: [23, 28],
				bio: [29, 34],
				quim: [35, 40],
				mat: [41, 48],
				fis: [49, 54]
			};

			for (var i = 0; i < 54; i++) {
				if (arranswers[i] == answersel[i] || answersel[i] == "X") {
					pontos++;
					for (const [key, value] of Object.entries(intervals)) {
						if (i + 1 >= value[0] && i + 1 <= value[1]) {
							pontosPorMateria[key]++;
							break;
						}
					}
				}
			}

			function g(fullName) {
					// Dividindo o nome completo em palavras
					const words = fullName.trim().split(/\s+/);

					// Preferência para o primeiro e segundo nome
					const firstName = words[0];
					const secondName = words[1];

					// Verificar se o segundo nome está entre "de", "da", "dos", "das", "do", "henrique" ou "luiza"
					if (["de", "da", "dos", "das", "do", "henrique", "luiza"].includes(secondName.toLowerCase())) {
							// Verificar se o terceiro nome está entre "de", "da", "dos", "das" ou "do"
							if (["de", "da", "dos", "das", "do"].includes(words[2].toLowerCase())) {
									return `${firstName} ${secondName} ${words[2]} ${words[3]}`;
							} else {
									return `${firstName} ${secondName} ${words[2]}`;
							}
					}

					// Caso contrário, exibir apenas o primeiro e o segundo nome
					return `${firstName} ${secondName}`;
			}


      const u = {
        user: {
        	name: g(r[t].name),
					completename: r[t].name,
					turma: Number(r[t].turma) >= 4 ? Number(r[t].turma) - 3 : r[t].turma,
        	pont: pontos,
					letras: r[t].answers.split(""),
					port: pontosPorMateria.port,
					lit: pontosPorMateria.lit,
					bio: pontosPorMateria.bio,
					fis: pontosPorMateria.fis,
					quim: pontosPorMateria.quim,
					hist: pontosPorMateria.hist,
					geo: pontosPorMateria.geo,
					mat: pontosPorMateria.mat,
					percent: round(pontos/54*100,1),
					id: r[t].id
	      }
      }

      for (var key in u) {
	    	array.push(u[key]);
      }

			if(sel < 4){
      	array.sort(function(a, b){
        	return (b.pont) - (a.pont) || a.name.localeCompare(b.name)
     	 })
			}else{
				array.sort(function(a, b){
        	return a.name.localeCompare(b.name)
     	 })
			}

      for (var i = 0; i < array.length; i++) {
	      array[i].rank = i + 1;
      }
    }
		res.send(array)
	})
})
