module.exports = async(filter, find = 'username'){
	let regex = /[,/:*-+|\!@#$%¨&-=]/gmi
	if(/pass/i.test(find)) regex = /1234|112233|/gmi
		
	if(regex.test(find)) return false
	return true
}