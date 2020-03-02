const H = require('snabbdom/h').default
const DefaultIPs = require('fantastic-utils/defaultips')

const tooltip = state => {
  if (state.hovered.ui || !state.hovered.nodes.length || !state.vis) return
  const node_id = state.hovered.nodes[state.hovered.nodes.length - 1]
  const node = state.nodes[node_id]
  const box = state.vis.getBoundingBox(node_id)
  const pos = state.vis.canvasToDOM({x: box.left, y: box.top})
  const ip = node.ips.find(v => !DefaultIPs.includes(v))
  return H('div#tooltip', {style: {left: `${pos.x}px`, bottom: `calc(100% - ${pos.y - 16}px)`}}, [
    H('div', ip ? `IP: ${ip}` : 'no IP address data!'),
    node.macs && node.macs.length ? H('div', `MAC: ${node.macs[0].mac}`) : undefined,
    node.os ? H('div', node.os) : undefined,
    H('div', `${(node.connections && node.connections.length) || 0} connection${node.connections && node.connections.length === 1 ? '' : 's'}`)
  ])
}

module.exports = tooltip