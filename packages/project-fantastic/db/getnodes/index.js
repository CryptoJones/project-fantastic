const {transaction, OPEN_READONLY} = require('../operations')
const ConnectionConditions = require('./connectionconditions')
const GetConnections = require('./getconnections')

/**
 * Retrieve nodes from the database based on the query object
 * @param {import('../types').NodeQuery} query 
 * @returns {Promise<Array.<import('../types').Node & {connections: [], node_id: number}>>}
 */
const getNodes = async query => {
  const date_conditions = [ // if we didn't supply a date we want to get all of the results
    query.date && {columns: {date: query.date}, compare: '>='}, 
    query.max_date && {columns: {first_date: query.max_date}, compare: '<='}
  ] 
  const node_access = query.access && query.access.filter(v => v)
  const access_condition = node_access && node_access.length && {columns: {access: node_access}, compare: 'IN'}
  const db = await transaction(OPEN_READONLY)
  const rows = await db.all({table: 'nodes', conditions: {groups: [...date_conditions, query.nodes && Array.isArray(query.nodes) && {columns: {node_id: query.nodes}, compare: 'IN'}, access_condition]}})
  const connection_filter = {
    local_ip_id: query.connection_local_ip && (await db.get({table: 'ips', columns: ['ip_id'], conditions: {columns: {ip: query.connection_local_ip}}})).ip_id,
    remote_ip_id: query.connection_remote_ip && (await db.get({table: 'ips', columns: ['ip_id'], conditions: {columns: {ip: query.connection_remote_ip}}})).ip_id,
    process_id: query.connection_process && (await db.get({table: 'processes', columns: ['process_id'], conditions: {columns: {pid: query.connection_process}}})).process_id,
  }
  const nodes = []
  for (const r of rows) {
    const ips = await db.all({table: 'ips', conditions: {groups: [{columns: {node_id: r.node_id}}, ...date_conditions]}})

    const connections = await GetConnections(db, ips, query, date_conditions, connection_filter)
    const valid_connections = connections.length || await db.get({table: 'connections', conditions: {groups: [...date_conditions, ...ConnectionConditions('to', ips, query, connection_filter)]}})
    if (!r.important && (query.show_external !== 'true' || !valid_connections)) continue
    const macs = await db.all({table: 'macs', conditions: {groups: [{columns: {node_id: r.node_id}}]}}) // if we got this far we want to add the MAC Addresses for this node
    nodes.push({...r, connections, ips: ips.map(v => v.ip), macs})
  }
  await db.close()
  return nodes
}

module.exports = getNodes