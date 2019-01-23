import getDefaultPreferences from './getDefaultPreferences'

export default function getPreferences(req) {
  let preferences
  try {
    preferences = JSON.parse(req.cookies['FRONTFUL_CONTENT_PREFERENCES'])
  }
  catch (err) {
    preferences = getDefaultPreferences()
  }
  return preferences
}
