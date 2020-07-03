const GetData = require('./getdata')

const getFavorites = (db, user) => db.all({table: 'favorites', conditions: {columns: {user_id: user.user_id}}, order_by: 'sorting'})
  .then(rows => Promise.all(rows.map(v => db.get({table: 'all_history', conditions: {columns: {history_id: v.history_id}}}).then(row => ({...v, ...row})))))
  .then(rows => GetData(db, rows))

module.exports = getFavorites