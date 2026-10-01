import httpClient from './httpClient'

export const githubApi = {
  getRepository(owner, repo) {
    return httpClient.get(`/repos/${owner}/${repo}`)
  },

  getUser(username) {
    return httpClient.get(`/users/${username}`)
  },
}
