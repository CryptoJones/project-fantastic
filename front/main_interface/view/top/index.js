const H = require('snabbdom/h').default
const Search = require('./search')

const top = (state, send) => H('div#top', [
  H('h1', "Fantastic"),
  Search(state, send),
  state.user ? H('div.buttons', [
    H('div.user_info', [
      H('div.username', state.user.username),
      H('div.item', `Role: ${state.user.role}`)
    ]),
    H('div.icon_button', {
      on: {click: e => window.open('/auth', '_self')}
    }, [
      H('span.fas fa-user-circle fa-fw'),
      H('div.label', 'Account')
    ]),
    H('div.icon_button', {
      on: {click: e => window.open('/logout', '_self')}
    }, [
      H('span.fas fa-sign-out-alt fa-fw'),
      H('div.label', 'Log Out')
    ]),
    H('div.icon_button', {
      on: {click: e => window.open('help/index.md', '_blank')}
    }, [
      H('span.fas fa-question-circle fa-fw'),
      H('div.label', 'Help')
    ])
  ]) : undefined
])

module.exports = top