import React, { Component } from 'react';
import {StyleSheet, Dimensions, Alert, } from 'react-native';
import firebaseSvc from './../config';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Button,
    Text,
    Body,
    Thumbnail
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { ImagePicker , Permissions} from 'expo';
import {MaterialIcons} from '@expo/vector-icons';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            user: {
                name: '',
                email: '',
                avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHkAeQMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQIGBQQHA//EADgQAAICAQIDBAcECwEAAAAAAAABAgMEBREGEkEhMVGhEyJhcZGx4VJigcEkMjQ2QnOCorLR8BX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAfndfVRHmtsjBeMnseDVtSrxU6oOTufSL7ve+hmLbJWzc7JOUn1b3A1MtawIy29LJ+1QZ57+IKK5bVVysXjvt8zNMhsDRVcR1uzazHnGH2oy32/A7NF9eRUrKZqcH3NGCZ7NL1CWBkc3bKqX68F19vvA2oOJRxJizmo3V2VL7T7V5Hai1JJp7p9zAkAAAAAAAA82o5EsXDtuit5RXZ72ek5vED20yz3x+aAy05OUnKbcpN7tvqUbDZG4Aq2GyGwDZVsNlWwDfabbQbHZpdPNJS5Vy7p9F+fQw7NPwg26clb9imuz8ANCAAAAAAAAc7X1vpdvscX5o6Jz9ctqhp9tdlkYynH1E+9sDIbkNkMhgGyrYbKtgGyAVbKDZqeD1+i5EvGxLy+plWanhK+hYs6PSR9O5uXJ122RBoQAAAAAAADKcTSb1JJ90a1t5mrM3xViyVteVFbxa5Jex9PmBwWVbDZVsA2QCrKDIZDIbANnr0abhq2I4vZ+lS+PZ+Z4mdXhnEnk6pXZs/R0evJ+3ovj8gNyACAAAAAAFbK4WwcLIqUWtmmt0ywAynEenU4cabMavkhJuMlu3296/M4ZvtRxI5uJZRLs5l2Pwa7mYK6udNsqrYuM4PaSfRgUbKtktlWyg2VbDZUDqcO4MNQz+S6HNTCDc1vtv0X/AHsNti4tGJUqseuNcF0Rz+HdOeBgp2R2utfNNeHgjrEAAAAAAAAAA/K/Ipx1vfbCtfekkB+pkuMIxjmUSiknKt7vx2Z1MjiTAp39HKdzXSEdvN7Gc1rU/wD07oT9F6NQWyW+7YHPbKNktlSgdLhuMZ61jKcVJLmez8Unscxs9Gm5rwM6vJUFZyb+rvtvutgj6SgZ/G4swbNlfC2h9W1zLy/0dfFz8TL/AGfJqsfhGS3+HeRXpAAAAAUuthTXKy2SjCK3bfRGdy+J3zOOJQtukrOv4fU/bi3IcMWmhd1km5e1L6vyMq2B78jWc/I35siUV4V+r8jnybk95Nt+Le4ZVsoNlWw2VAEMMqwgyGw2UbANkbkMgD34us6jibKnLs5V/DN8y8zrYnGWTBpZeNXZHrKt8r+HavkZllWwPqmn51Go40cjGlvB9jT7HF+DR6TDcC5Uq9Ruxt/Utr5kvvL6Nm47CKy/GD/SMZeEJPzM8zv8YftWP/LfzM+wIbKtksqyiCGSVYRDKtlmVYFWyrLMqwIIZJDAq2VbJZVgdnhCW3EGN7VNf2s+jnzbhH94MX+r/Fn0kiv/2Q==',
                username: '',
                password: '',
                c_password: '',
            }
        }
    }

    _handleChange = (data, name) => {
        const { user } = this.state;
        user[name] = data;

        this.setState({
            ...this.state,
            user
        });
    }

    _handleSubmit = async() => {
        this.setState({
            spinnerVisible: true
        });
        const { user } = this.state;
        if((user.password == user.c_password) && user.password.length > 1){
            try {
                await firebaseSvc.createAccount(user, (data) => {
                    if (data.status) {
                        this.setState({
                            spinnerVisible: false
                        });
                        setTimeout(() => {
                            Alert.alert(
                                "User Successfully Created",
                                "Please Login",
                                [{
                                    text: "Try Again",
                                    onPress: () => console.log('OK Pressed')
                                }], {
                                    cancelable: false
                                }
                            );
                        }, 1500);
                        this.props.navigation.navigate("Login");
                    } else {
                        this.setState({
                            spinnerVisible: false
                        });
                        setTimeout(() => {
                            Alert.alert(
                                "Error",
                                data.message,
                                [{
                                    text: "Try Again",
                                    onPress: () => console.log('OK Pressed')
                                }], {
                                    cancelable: false
                                }
                            );
                        }, 1500);
                    }
                });
            } catch ({ message }) {
                this.setState({
                    spinnerVisible: false
                });
                setTimeout(() => {
                    Alert.alert(
                        "Error",
                        "Please check your internet connection",
                        [{
                            text: "Try Again",
                            onPress: () => console.log('OK Pressed')
                        }], {
                            cancelable: false
                        }
                    );
                }, 1500);
            }
        }else{
            this.setState({
                spinnerVisible: true
            });
            setTimeout(() => {
                Alert.alert(
                    "Error",
                    "Passwords do not match !",
                    [{
                        text: "Try Again",
                        onPress: () => console.log('OK Pressed')
                    }], {
                        cancelable: false
                    }
                );
            }, 1500);
        }
    }


    getProfileImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            const { user } = this.state;
            user.avatar = result.uri;
            this.setState({
                user
            })
        }
    }

    pickImage = async() => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (status === 'granted') {
            this.getProfileImage();
        } else {
            alert('permission denied');
        }
    }

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Registering...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Content style={{marginTop: 5,}}>
                    <Body>
                        <Thumbnail large style={styles.formGroup} source={{ uri: this.state.user.avatar }} />
                        {/* <TouchableOpacity onPress={this.pickImage}>
                            <MaterialIcons size={30} name="edit"/>
                        </TouchableOpacity> */}
                    </Body>
                    <Form>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.name}
                                // autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Full Name"
                                onChangeText={(text) => this._handleChange(text, 'name')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.email}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="LMU Webmail"
                                onChangeText={(text) => this._handleChange(text, 'email')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.username}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Username"
                                onChangeText={(text) => this._handleChange(text, 'username')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                secureTextEntry={true}
                                value={this.state.user.password}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Password"
                                onChangeText={(text) => this._handleChange(text, 'password')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                secureTextEntry={true}
                                value={this.state.user.c_password}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Confrim Password"
                                onChangeText={(text) => this._handleChange(text, 'c_password')}
                            />
                        </Item>
                    </Form>
                    <Button dark onPress={this._handleSubmit} style={{ alignSelf: 'center' }}>
                        <Text> Signup </Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 5,
        paddingLeft: 5,
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: 10,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    formGroup: {
        marginBottom: 10,
        // justifyContent: "center",
        // alignItems: "center"
    }
});
