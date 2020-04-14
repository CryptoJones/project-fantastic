const compare = (value, condition) => { // TODO: we might have to make this into some kind of parser. but for now we just use eval
  return eval(`${value} ${condition}`)  
}

const checkResult = (result, condition) => {
  for (const c of Object.entries(condition)) {
    const result_entry = result.find(r => r.id == c[0])
    if (result_entry == undefined) return false
    if (typeof c[1] == 'object') {
      if (!result_entry.value.find(
          v => Object.keys(c[1]).every(
            k => Object.keys(v).includes(k) && compare(v[k], c[1][k]))) // the value needs to have all the keys we're searching for and pass all the comparisons on each of those
        ) return false
    }
    else if (!result_entry.value.find(v => compare(v, c[1]))) return false
  }

  return true
}

module.exports = checkResult