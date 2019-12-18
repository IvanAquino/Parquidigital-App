import gql from 'graphql-tag'

export const createParkedCarMutation = gql`
mutation createParkedCar ($input: CreateParkedCarRequest) {
    createParkedCar (input: $input) {
        _id
        finishAt
        licensePlate
    }
}
`

export const myActiveParkedCarQuery = gql`
query myActiveParkedCar {
    myActiveParkedCar {
        _id
        parkingFee {
            name
        }
        finishAt
        licensePlate
        time
        total
        location {
            type
            coordinates
        }
    }
}
`

export const myParkedCarsQuery = gql`
query myParkedCars {
    myParkedCars {
        _id
    }
}
`