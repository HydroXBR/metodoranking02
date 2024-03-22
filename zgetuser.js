async function getUser(id, pass){
	if(!id) throw "ID is not defined"

	const response = await  fetch(`https://gr8acess.yeshayahudesigndeveloper.repl.co/api?username=${ec(id)}&pass=${ec(pass)}&token=${token}&action=getuser`/*, {
		method: "GET"
	}*/)
	const rr = await response
	if(!rr) return false

	return rr
}