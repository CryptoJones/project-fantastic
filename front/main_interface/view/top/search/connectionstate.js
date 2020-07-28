import {h} from 'snabbdom/h'

const options = [
  'listen',
  'syn_sent',
  'syn_received',
  'established',
  'fin_wait_1',
  'fin_wait_2',
  'close_wait',
  'closing',
  'last_ack',
  'time_wait',
  'bound'
]

const selection_label = connection_state => {
  if (connection_state.length === 0 || connection_state.length === options.length) return 'all'
  if (connection_state.length === 1) return connection_state[0]
  return `${connection_state[0]} + ${connection_state.length - 1} more`
}

export default (state, send) => 
  h('div#connection_state.selector.checkboxes', {
    on: { focusout: e => {
        if (e.relatedTarget) { // this is a not very elegant way to check if we clicked outside of this element
          let target = e.relatedTarget
          while (target) {
            if (target.id === 'connection_state') return
            target = target.parentNode
          }
        }
        send({type: 'connection_foldout', value: false})
      }
    }
  }, [
    h('label', 'Connection state'),
    h('select', {on: {click: [send, {type: 'connection_foldout', value: !state.search.connection_foldout}]}},
      h('option', {attrs: {selected: true}}, selection_label(state.search.connection_state)) // this is a dummy option to show the selection
    ),
    state.search.connection_foldout ? h('div.states', 
      options.map(v => h('div.state', [
        h(`input#select${v}`, {
          attrs: {type: 'checkbox', checked: state.search.connection_state.includes(v)},
          on: {change: e => send({type: 'connection_state', state: v, value: e.target.checked})}
        }),
        h('label', {attrs: {for: `select${v}`}}, v)
      ]))) : undefined
  ])