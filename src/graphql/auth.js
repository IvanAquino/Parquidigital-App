import gql from 'graphql-tag'

export const authenticateMutation = gql`
mutation authentication ($input: AuthenticationRequest) {
  authenticate (input:$input) {
    expiresIn
    token
  }
}
`

export const createClientMutation = gql`
mutation createClient ($input: CreateClientRequest) {
    createClient (input: $input) {
        _id
    }
}
`