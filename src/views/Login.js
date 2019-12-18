import React, { useState, useRef, useEffect } from 'react'

import { View, ScrollView, StyleSheet } from 'react-native'
import { Layout, Text, Input, Button } from '@ui-kitten/components'
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from 'react-navigation-hooks'
import { useMutation } from 'react-apollo'
import { authenticateMutation } from '../graphql/auth'

export default function Login () {

    const { navigate } = useNavigation()

    useEffect(() => {
        AsyncStorage.getItem('auth').then(authData => {
            const auth = JSON.parse(authData)
            
            if ( auth.expiresIn <= Date.now() )  {
                AsyncStorage.clear()
            } else {
                navigate('HomeStackNavigator')
            }
        })
    }, [])

    const [authenticateAction, { loading }] = useMutation(authenticateMutation, {
        onCompleted: (data) => {
            AsyncStorage.setItem('auth', JSON.stringify({
                token: data.authenticate.token,
                expiresIn: (data.authenticate.expiresIn * 1000),
            }))
            navigate('HomeStackNavigator')
        },
        onError: (error) => {
            console.log(error)
            alert("Verifique sus credenciales")
        }
    })

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const inputPassword = useRef(null)

    return (
        <Layout style={styles.layout}>
            <ScrollView style={styles.container}>
                <Text category="h2" style={styles.textCenter}>ParquiDigital</Text>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder='Email'
                        value={username}
                        autoCapitalize="none" keyboardType="email-address" textStyle={{ padding: 0 }}
                        onChangeText={setUsername}
                        onSubmitEditing={() => inputPassword.current.focus()}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        ref={inputPassword}
                        placeholder='Contraseña'
                        value={password}
                        autoCapitalize="none"textStyle={{ padding: 0 }} secureTextEntry={true}
                        onChangeText={setPassword}
                        onSubmitEditing={() => {
                            authenticateAction({variables: {input: {
                                username, password,
                                type: 'client'
                            }}})
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Button
                        onPress={() => {
                            authenticateAction({variables: {input: {
                                username, password,
                                type: 'client'
                            }}})
                        }}
                    >Ingresar</Button>
                </View>
                <View style={styles.inputContainer}>
                    <Button status="basic"
                        onPress={() => {
                            navigate('Register')
                        }}
                    >No tengo cuenta, registrarme</Button>
                </View>
            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: { flex: 1 },
    container: {
        paddingTop: 70,
        backgroundColor: "#FAFAFA"
    },
    inputContainer: {
        marginBottom: 10,
        padding: 10
    },
    textCenter: {
        textAlign: 'center'
    }
})