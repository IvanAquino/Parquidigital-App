import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { nearParkingFeesQuery } from '../graphql/parkingFees'
import * as turf from '@turf/turf'

export const ParkingFeeContext = React.createContext()

export const ParkingFeeProvider = props => {

    const [screenBounds, setScreenBounds] = useState(null)

    const { data, error, loading } = useQuery(nearParkingFeesQuery, {
        variables: {input: {
            screenBounds
        }},
        skip: !screenBounds
    })

    const isInsideParkingFee = (region) => {
        if ( !data ) return {
            inParkingFee: false,
            parkingFee: null
        }

        for (let i = 0; i < data.nearParkingFees.length; i++) {
            const parkingFee = data.nearParkingFees[i];
            const polygon = turf.polygon(parkingFee.area.coordinates)
            const point = turf.point([region.longitude, region.latitude])

            if ( turf.booleanPointInPolygon(point, polygon)) return {
                inParkingFee: true,
                parkingFee
            }
        }

        return {
            inParkingFee: false,
            parkingFee: null
        }
    }

    const calculatePayPerTime = (time, parkingFee) => {
        if ( !parkingFee ) return 0
        const perMinute = parseFloat(parkingFee.perHour) / 60
        return time * perMinute
    }

    return (
        <ParkingFeeContext.Provider
            value={{
                setScreenBounds,
                data, error, loading,
                calculatePayPerTime,
                isInsideParkingFee
            }}
        >
            { props.children }
        </ParkingFeeContext.Provider>
    )
}