import {init} from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { attributesModule } from 'snabbdom/modules/attributes'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import View from './view'
import Update from './update'
import Effect from './effect'

const patch = init([
  classModule,
  propsModule,
  styleModule,
  attributesModule,
  eventListenersModule,
])

let state = { 
  action_results: {},
  flex_search: {actions: {}}
}
let vnode = document.body

const send = action=> {
  state = Update(state, action)
  vnode = patch(vnode, View(state, send))
  Effect(state,action,send) 
}
  
send({type:'init'})

window.state = state
window.send = send