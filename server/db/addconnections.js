const {get, update, insert} = require('./operations')
const GetProcess = require('../commands/getprocess')

const addConnections = async (node_id, connections) => {
  const date = Date.now()
  const processes = {} // track process names we already found to avoid calling the PowerShell script unnecessarily

  console.log(`adding ${connections.length} connections from node ${node_id} to database...`)

  // this function finds or creates and returns a row with a given IP
  const get_row = async ip => {
    let row = await get({table: 'ips', columns: ['ip_id'], conditions: {columns: {ip, node_id}}}) // first we have to find if a row already exists with the IP on the same node
    if (!row) row = await get({table: 'ips', columns: ['ip_id'], conditions: {columns: {ip}}}) // if not check if the IP corresponds to another node
    // TODO: we should sort IPs by date because it's likely that the most recent one is the correct one in the case of multiple entries with the same address
    if (row) { // if it exists we should update the date of the IP and the corresponding node
      await update({table: 'ips', row: {date}, conditions: {columns: {ip_id: row.ip_id}}}) // TODO: if the connection is from this IP, we should update the node_id because we know for sure the IP belongs to this node
      .then(() => get({table: 'ips', columns: ['node_id'], conditions: {columns: {ip_id: row.ip_id}}}))
      .then(res => update({table: 'nodes', row: {date}, conditions: {columns: {node_id: res.node_id}}}))
    } 
    else {
      row = await insert('nodes', {date}) // if not we have to insert a new node and then an IP belonging to this node
      .then(res => insert('ips', {ip, date, node_id: res}))
      .then(res => get({table: 'ips', columns: ['ip_id'], conditions:{columns: {ip_id: res}}}))
    }
    return row
  }

  for (const c of connections) {
    console.log(`adding connection from ${c.local_address} to ${c.remote_address}`)
    const name = processes[c.process] || await GetProcess(c.process)
    processes[c.process] = name
    // TODO: node which owns the process
    let process_id
    const process = await get({table: 'processes', columns: ['process_id'], conditions: {columns: {pid: c.process}}}) // find the process in the relevant table
    if (process) {
      if (name) await update({table: 'processes', row: {name}, conditions: {columns: {process_id: process.process_id}}}) // if we found it, we should update the name in case the ID now corresponds to a different process
      process_id = process.process_id
    } 
    else {
      process_id = await insert('processes', {pid: c.process, name}) // if we didn't find a process, insert it
    }
    const local = await get_row(c.local_address) // get the ip row for the local address
    const remote = await get_row(c.remote_address) // get the ip row for the remote address
    await get({table: 'connections', columns: ['connection_id'], conditions: {columns: { // check if we already have a connection identical to this one
      from_id: local.ip_id, 
      to_id: remote.ip_id, 
      local_port: c.local_port, 
      remote_port: c.remote_port
    }}})
    .then(res => res ?
      update({table: 'connections', row: {state: c.state, process_id, date}, conditions: {columns: {connection_id: res.connection_id}}}) : // if we do, update with fresh information
      insert('connections', { // if not, insert
        from_id: local.ip_id, 
        to_id: remote.ip_id, 
        process_id, 
        local_port: c.local_port, 
        remote_port: c.remote_port, 
        state: c.state, 
        date
      }) 
    )
  }

  console.log(`added ${connections.length} connections to database from node ${node_id} in ${Date.now() - date}ms.`)
}

module.exports = addConnections