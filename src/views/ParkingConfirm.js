import React, { useState, useContext } from 'react'

import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import {
    StyleSheet, 
    View,
    ScrollView
} from 'react-native'
import { Layout,
    TopNavigation,
    TopNavigationAction,
    Text,
    Button,
    Input,
    Select
} from '@ui-kitten/components'
import { Icon } from 'react-native-eva-icons'

import { useMutation } from 'react-apollo'
import { createParkedCarMutation, myActiveParkedCarQuery } from '../graphql/parkedCar'
import { ParkingFeeContext } from '../context/ParkingFeeContext';

export default function ParkingConfirm () {
    const { goBack } = useNavigation()
    const parkingFee = useNavigationParam("parkingFee")
    const time = useNavigationParam("time")
    const region = useNavigationParam("region")
    const parkingFeeContext = useContext(ParkingFeeContext)
    

    const [licensePlate, setLicensePlate] = useState("")
    const [createParkedCarAction, { loading }] = useMutation(createParkedCarMutation, {
        refetchQueries: [
            { query: myActiveParkedCarQuery }
        ],
        onCompleted: (data) => {
            goBack()
        },
        onError: (error) => {
            console.log(JSON.stringify(error))
            alert("Ha ocurrido un error al ocupar el espacio")
        }
    })

    return (
        <Layout style={styles.layout}>
            <TopNavigation
                title="Confirmar"
                leftControl={
                    <TopNavigationAction
                        icon={() => <Icon name="arrow-back-outline"/>}
                        onPress={() => goBack()}
                    />
                }
            />
            <ScrollView style={{ padding: 10 }}>
                <Input 
                    autoCapitalize="characters"
                    placeholder="Ingresa PLACA"
                    textStyle={{ padding: 0 }}
                    style={styles.marginBottom10}
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                />

                <View style={{ paddingVertical: 10 }}>
                    <Text category="h6" style={{ textAlign: 'center' }}>
                        Tiempo: {time} minutos
                    </Text>
                </View>

                <View style={{ paddingVertical: 10 }}>
                    <Text category="h6" style={{ textAlign: 'center' }}>
                        Costo: $ {parkingFeeContext.calculatePayPerTime(time, parkingFee)}
                    </Text>
                </View>

            </ScrollView>

            <View style={{ padding: 10 }}>
                <Button
                    status="warning"
                    style={styles.marginBottom10}
                    onPress={() => goBack() }
                    disabled={loading}
                >Cancelar</Button>
                <Button
                    disabled={loading}
                    onPress={() => {
                        if ( !licensePlate ) {
                            alert("Ingrese la placa de su vehiculo")
                            return false
                        }
                        
                        createParkedCarAction({variables: {input: {
                            parkingFeeId: parkingFee._id,
                            licensePlate: licensePlate,
                            time: time,
                            coordinates: [region.longitude, region.latitude]
                        }}})
                    }}
                >Aparcar</Button>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: { flex: 1 },
    marginBottom10: {
        marginBottom: 10
    }
})