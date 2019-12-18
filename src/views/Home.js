import React, { useContext, useState, useEffect } from 'react'

import { 
    ActivityIndicator,
    Dimensions, 
    Image, 
    StyleSheet, 
    View
} from 'react-native'
import { Layout,
    Text,
    Button,
    Input,
    Modal,
    Select
} from '@ui-kitten/components'
import { useNavigation } from 'react-navigation-hooks'
import MapView, { Marker, Polygon } from 'react-native-maps';

import { initialRegion, mapStyles } from '../settings/map';
import { ParkingFeeContext } from '../context/ParkingFeeContext';
import { useQuery } from 'react-apollo';
import { myActiveParkedCarQuery } from '../graphql/parkedCar';
import Countdown from 'react-countdown-now';

const availableTimes = [
    {text: '20 min', value: 20},
    {text: '30 min', value: 30},
    {text: '40 min', value: 40},
    {text: '60 min', value: 60},
]

const useScreenDimensions = () => {
    const [windowData, setWindowData] = useState(Dimensions.get('window'));
  
    useEffect(() => {
      const onChange = result => {
        setWindowData(result.window);
      }
  
      Dimensions.addEventListener('change', onChange)

      return () => Dimensions.removeEventListener('change', onChange)
    });
  
    return {
      ...windowData,
      isLandscape: windowData.width > windowData.height,
    }
}

const useActiveParkedCar = () => {
    const { data, loading, error, refetch } = useQuery(myActiveParkedCarQuery)
    
    let dataActiveParkedCar = (!!data) ? data.myActiveParkedCar: null

    return {
        activeParkedCar: dataActiveParkedCar,
        loadingActiveParkedCar: loading,
        errorActiveParkedCar: error,
        refetchActiveParked: refetch
    }
}

export default function Home () {
    const parkingFeeContext = useContext(ParkingFeeContext)

    const { activeParkedCar, loadingActiveParkedCar, refetchActiveParked } = useActiveParkedCar()

    const [insideParkingFee, setInsideParkingFee] = useState({inParkingFee: false, parkingFee: null})
    const [selectedTime, setSelectedTime] = useState(availableTimes[0])
    const [region, setRegion] = useState(initialRegion)

    const { navigate } = useNavigation()

    const { height, width } = useScreenDimensions()
    let fakeMarkerHeight = height - 56;
    let fakeMarkerWidth = width;

    return (
        <Layout style={styles.layout}>
            <MapView
                style={styles.map}
                customMapStyle={mapStyles}
                initialRegion={initialRegion}
                onMapReady={() => {
                    let screenBounds = regionToPolygon(initialRegion)
                    parkingFeeContext.setScreenBounds(screenBounds)
                }}
                onRegionChangeComplete={(region) => {
                    let result = parkingFeeContext.isInsideParkingFee(region)
                    setInsideParkingFee(result)
                    setRegion(region)
                }}
            >
                {!!parkingFeeContext.data && (
                    <>
                        {parkingFeeContext.data.nearParkingFees.map((item, index) => {
                            return (
                                <Polygon 
                                    key={index}
                                    strokeColor="rgba(67, 107, 204, 0.8)"
                                    fillColor="rgba(28, 109, 241, 0.1)"
                                    coordinates={item.area.coordinates[0].map(item => {
                                        return {
                                            latitude: item[1],
                                            longitude: item[0]
                                        }
                                    })}
                                />
                            )
                        })}
                    </>
                )}

                {/* Display active parked car */}
                {!!activeParkedCar && (
                    <Marker
                        pinColor={"red"}
                        coordinate={{
                            latitude: activeParkedCar.location.coordinates[1],
                            longitude: activeParkedCar.location.coordinates[0]
                        }}
                    />
                )}
            </MapView>

            {/* Center window marker */}
            { !activeParkedCar && !loadingActiveParkedCar && (
                <Image source={require('../assets/marker.png')} style={{
                    position: 'absolute',
                    left: ((fakeMarkerWidth / 2) - 14),
                    top: ((fakeMarkerHeight) / 2 - 25)
                }} />
            )}

            <View style={styles.topControls}>
                {!activeParkedCar && (
                    <>
                        <Text style={{ textAlign: 'center' }} category="s1">Coloca el marcador rojo dentro de una zona azul</Text>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic' }} category="p1">Las zonas azules representan las areas de estacionamiento disponibles</Text>
                        <Select 
                            data={availableTimes}
                            onSelect={setSelectedTime}
                            selectedOption={selectedTime}
                        />
                    </>
                )}
                {!!activeParkedCar && (
                    <>
                        <Text style={{ textAlign: 'center' }} category="s1">Estacionado</Text>
                        <Countdown
                            date={new Date(parseInt(activeParkedCar.finishAt))}
                            renderer={({ hours, minutes, seconds, completed }) => {
                                if ( completed ) {
                                    refetchActiveParked()
                                }
                                return (<Text category="h4" style={{ textAlign: 'center' }}>{hours}:{minutes}:{seconds}</Text>)
                            }}
                        />
                    </>
                )}
            </View>
            <View style={styles.bottomControls}>
                {parkingFeeContext.loading && (
                        <View style={styles.alignCenter}>
                            <ActivityIndicator size="large"/>
                        </View>
                )}

                {!parkingFeeContext.loading && insideParkingFee.inParkingFee && !activeParkedCar && (
                    <Button status="info"
                        onPress={() => {
                            navigate("ParkingConfirm", {
                                time: selectedTime.value,
                                parkingFee: insideParkingFee.parkingFee,
                                region: region
                            })
                        }}
                    >
                        Aparcar 
                        ( $ {parkingFeeContext.calculatePayPerTime(selectedTime.value, insideParkingFee.parkingFee)} )
                    </Button>
                )}
            </View>

        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: { flex: 1 },
    alignCenter: { alignItems: 'center', justifyContent: 'center' },
    bottomControls: {
        backgroundColor: "rgba(250,250,250, 0.6)", 
        bottom: 0, 
        padding: 10, 
        position: 'absolute', 
        width: '100%'
    },
    topControls: {
        backgroundColor: "rgba(250,250,250, 0.7)", 
        padding: 10, 
        position: 'absolute', 
        top: 0, 
        width: '100%'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    marginBottom10: {
        marginBottom: 10
    }
})

function regionToPolygon (region) {
    return {
        type: 'Polygon',
        coordinates: [[
            [ 
                (region.longitude - region.longitudeDelta), 
                (region.latitude - region.latitudeDelta) 
            ],
            [ 
                (region.longitude - region.longitudeDelta), 
                (region.latitude + region.latitudeDelta) 
            ],
            [ 
                (region.longitude + region.longitudeDelta), 
                (region.latitude + region.latitudeDelta) 
            ],
            [ 
                (region.longitude + region.longitudeDelta), 
                (region.latitude - region.latitudeDelta) 
            ],
            [ 
                (region.longitude - region.longitudeDelta), 
                (region.latitude - region.latitudeDelta) 
            ],
        ]]
    }
}