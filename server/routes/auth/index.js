const GetCookie = require('fantastic-utils/getcookie')
const GetConfig = require('../../util/getconfig')
const GetPackage = require('../../util/getpackage')

const cookie_name = 'session_id'
const auth = async header => {
  const config = await GetConfig()
  const session_id = GetCookie(header, cookie_name)
  if (!session_id) return
  const auth_module = await GetPackage(config.authentication)
  return await auth_module.verify(session_id)
}
module.exports = auth