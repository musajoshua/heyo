import React, { Component } from 'react';
import { Alert, AsyncStorage, StyleSheet, Dimensions} from 'react-native';
import firebasesvc from './../config';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Button,
    Text,
    Card,
    CardItem
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            user : {
                email : '',
                password : ''
            }
        };
    }

    _handleChange = (data, name) => {
        const { user } = this.state;
        user[name] = data;

        this.setState({
            ...this.state,
            user
        });
        this.verifyInput()
    }

    verifyInput = () => {
        const { user } = this.state;

        if(user.email == '' || user.password == ''){
            return true;
        }else{
            return false;
        }
    }

    _handleSubmit = async() => {
        this.setState({
            spinnerVisible: true
        });
        let { user } = this.state;
        firebasesvc.login(user,
        async(data) => {
            this.setState({
                spinnerVisible: false
            });
            const {uid, email, name, avatar} = data.val();
            user = {uid, email, name, avatar};
            await AsyncStorage.setItem('@SAM', JSON.stringify({user}));
            this.props.navigation.navigate("Contacts");
        },
        () => {
            this.setState({
                spinnerVisible: false
            });
            setTimeout(() => {
                Alert.alert(
                    "Error",
                    "Wrong email and password",
                    [{
                        text: "Try Again",
                        onPress: () => console.log('OK Pressed')
                    }], {
                        cancelable: false
                    }
                );
            }, 1500);
        });
    }

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Logging...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Content>
                    <Form style={{marginTop: 50,}}>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.email}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Email"
                                onChangeText={(text) => this._handleChange(text, 'email')}
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
                    </Form>
                    <Button primary disabled={this.verifyInput()} onPress={this._handleSubmit} style={{ alignSelf: 'center' }}>
                        <Text> Login </Text>
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
