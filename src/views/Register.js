import React, { useState, useRef } from 'react'

import { View, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import {
    Layout, 
    TopNavigation, TopNavigationAction,
    Input, Button
} from '@ui-kitten/components'
import { Icon } from 'react-native-eva-icons';
import { useMutation } from 'react-apollo';
import { createClientMutation } from '../graphql/auth';

export default function Register () {
    const { goBack } = useNavigation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [createClientAction, { loading }] = useMutation(createClientMutation, {
        onCompleted: (data) => {
            console.log(data)
            alert("Ahora puede iniciar sesión")
            goBack()
        },
        onError: (error) => {
            console.log(error)
            alert("Ha ocurrido un error al registrar su usuario")
        }
    })

    const inputEmail = useRef(null)
    const inputPassword = useRef(null)

    return (
        <Layout style={styles.layout}>
            <TopNavigation 
                title="Registro de usuario"
                leftControl={
                    <TopNavigationAction 
                        icon={() => <Icon name="arrow-back-outline"/>}
                        onPress={() => goBack()}
                    />
                }
            />
            <ScrollView style={styles.container}>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder='Nombre'
                        value={name}
                        textStyle={{ padding: 0 }}
                        onChangeText={setName}
                        onSubmitEditing={() => inputEmail.current.focus()}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        ref={inputEmail}
                        placeholder='Email'
                        value={email}
                        autoCapitalize="none" keyboardType="email-address" textStyle={{ padding: 0 }}
                        onChangeText={setEmail}
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
                            createClientAction({variables: {input: {
                                name, email, password
                            }}})
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Button
                        onPress={() => {
                            createClientAction({variables: {input: {
                                name, email, password
                            }}})
                        }}
                    >Registrarme</Button>
                </View>
                <View style={styles.inputContainer}>
                    <Button
                        status="basic"
                        onPress={() => goBack()}
                        disabled={loading}
                    >Ya tengo cuenta, ingresar</Button>
                </View>
            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: { flex: 1 },
    container: {
        backgroundColor: "#FAFAFA"
    },
    inputContainer: {
        padding: 10
    }
})