const H = require('snabbdom/h').default
const HostString = require('../../../util/hoststring')
const Result = require('./result')

const actions = (state, send, node) => {
  if (!state.actions) return
  const hostname = node.access === 'local' ? null : node.hostname
  return H('div.selection_panel', 
    H('div.scroll_container.section', [
      H('div.scroll', Object.entries(state.actions).filter(v => v[1].hosts.includes('none') || v[1].hosts.includes(node.access)).map(v => {
        const loading = state.action_results.status[node.hostname] && state.action_results.status[node.hostname][v[0]] === 'loading'
        return H('div.scroll_item', [
          H('div.item', [
            H('div.subtitle', v[1].name),
            H('div.button', 
              { 
                on: loading ? undefined : {click: [send, {type: 'perform_action', action: v[0], hostname, host: node.hostname}]},
                class: {loading}
              }, 
              loading ? 'Running...' : 'Run')
          ]),
          v[1].description ? H('div.item', v[1].description) : undefined,
          H('div.targets', [H('b', 'Valid targets:'), ` ${v[1].hosts.map(HostString).join(', ')}.`]),
          state.action_results.data[node.hostname] && state.action_results.data[node.hostname][v[0]] ? H('div.results', [
            H('div.followup', [
              H('div.subtitle', 'Results'), 
              H('div.foldout', {
                on: {click: [send, {type: 'result_foldout', action: v[0], hostname: node.hostname, value: !state.action_results.foldouts[node.hostname][v[0]]}]},
                class: {disabled: !state.action_results.foldouts[node.hostname][v[0]]}
              })
            ]),
            ...(state.action_results.foldouts[node.hostname][v[0]] ? Object.entries(state.action_results.data[node.hostname][v[0]]).map(r => Result(v[0], {key: r[0], value: r[1]}, hostname, node.hostname, send)) : [])
          ]) : undefined
        ])
      }))
    ])
  )
}

module.exports = actions