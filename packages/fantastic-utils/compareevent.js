const compareEvent = (a, b) => {
  if (!a || !b) return false
  if (a.event_type != b.event_type) return false
  if (a.event_type == 'quest') return a.quest === b.quest
  if (a.event_type == 'test') {
    if (a.test !== b.test) return false
    const a_parameters = JSON.parse(a.parameters)
    const b_parameters = JSON.parse(b.parameters)
    return Object.entries(a_parameters).every(v => b_parameters[v[0]] === v[1])
  }
  if (a.event_type == 'command') return a.command === b.command && a.status === b.status
  return false
}

module.exports = compareEvent