const H = require('snabbdom/h').default

const address = (ip, port) => `${(ip.includes(':') ? `[${ip}]` : ip)}:${port}`

const info = (state, send) => {
  if (state.selected.node === undefined) return
  const node = state.nodes[state.selected.node]
  return H('div#info', [
    H('div.section', [
      H('div.title', 'Info'),
      H('div.address', `Local address: ${node.ip}`)
    ]),
    H('div.section', [
      H('div.subtitle', `Connections (${node.connections.length}):`),
      H('div.connections', node.connections.map(v => H('div.connection', [
        H('div.item', `Local port: ${v.local_port}`),
        H('div.item', `Remote address: ${address(v.remote_address, v.remote_port)}`),
        H('div.item', `Process: ${v.process.name}`),
        H('div.item', `State: ${v.state.replace('_', ' ')}`)
      ])))
    ])
  ])
}

module.exports = info