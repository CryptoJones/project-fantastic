const H = require('snabbdom/h').default

const display = (action, line, foldout, hostname, host, send, id, keys) => {
  if (typeof(line) === 'object') {
    if (line.type == 'button') return H('div.followup', [
      H('div.button', 
      {
        on: {click: [send, {
          type: 'action_followup', 
          action,
          function: line.click.function,
          data: line.click.data,
          hostname,
          host,
          id,
          keys
        }]},
        class: line.class
      },
      line.text),
      typeof foldout[line.click.function] === 'boolean' ? H('div.foldout', {
        on: {click: [send, {
          type: 'followup_foldout',
          action,
          function: line.click.function,
          hostname: host,
          id,
          keys,
          value: !foldout[line.click.function]
        }]},
        class: { disabled: !foldout[line.click.function]}
      }) : undefined
    ])
  }
  return H('div.text', line)
}

const result = (action, action_result, hostname, host, send, keys = []) => H('div.result', Object.entries(action_result.value).map((v, i, arr) => {
    if (v[0] === 'foldout') return  
    if (v[0] === 'value') return H('div.item', v[1].map(v => display(action, v, action_result.value.foldout, hostname, host, send, action_result.key, keys)))
    return action_result.value.foldout[v[0]] ? 
      Object.entries(v[1])
        .map(r => result(action, {key: r[0], value: r[1]}, hostname, host, send, [...keys, {function: v[0], id: action_result.key}])) :
      undefined
}).flat())


module.exports = result