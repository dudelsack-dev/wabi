import { getAdProfile } from '../../intents/service.js'

export const profileResource = {
  uriTemplate: 'user://{userId}/profile',
  name: 'Ad Profile',
  description: "A user's full advertising intent profile (wants, has, revoked, platform configs)",
  mimeType: 'application/json',
  handler: async (uri: URL) => {
    const userId = uri.pathname.replace(/^\/\//, '').split('/')[0]
    if (!userId) throw new Error('userId missing in URI')
    const profile = await getAdProfile(userId)
    return { contents: [{ uri: uri.toString(), mimeType: 'application/json', text: JSON.stringify(profile, null, 2) }] }
  },
}
