import gql from 'graphql-tag'

export const nearParkingFeesQuery = gql`
query nearParkingFees ($input: NearParkingFeesRequest) {
    nearParkingFees (input: $input) {
        _id
        name
        perHour
        area {
            type
            coordinates
        }
    }
}
`