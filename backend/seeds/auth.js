export const unknownUser = {
  email: 'unknown@closetinn.com.br',
  password: '123456'
}

export const invalidToken = '123123'

export const invalidAuthFacebookUserTestCases = [
  {
    userID: '123123',
    accessToken: '123'
  },
  {
    email: 'unknown@gmail.com',
    accessToken: '123'
  },
  {
    email: 'unknown@gmail.com',
    userID: '123123'
  },
]
