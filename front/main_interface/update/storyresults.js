export default (state, action) => {
  if (!action.results) return
  const data_store = state.story_results.data[action.story] || (state.story_results.data[action.story] = {})
  const status_store = state.story_results.status[action.story] || (state.story_results.status[action.story] = {})
  const date_store = state.story_results.date[action.story] || (state.story_results.date[action.story] = {})
  const test_id_store = state.story_results.test_ids[action.story] || (state.story_results.test_ids[action.story] = {})
  data_store[action.node] = action.results
  status_store[action.node] = 'loaded'
  date_store[action.node] = action.date
  test_id_store[action.node] = action.test_id
}