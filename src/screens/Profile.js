import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Dimensions,
    Alert,
    TouchableOpacity
} from 'react-native';
import { Container, Header, Body, Text, Content, Form, Input, Item, Thumbnail, Row, Left, Right} from 'native-base';
import firebaseSvc from '../config';
import Spinner from 'react-native-loading-spinner-overlay';
import { ImagePicker , Permissions} from 'expo';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            spinnerText: '',
            sender : {}
        };
    }

    componentDidMount = async () => {
        await this.setSendersDetails();
    }

    logout = async() => {
        await AsyncStorage.removeItem('@SAM');
        this.props.navigation.navigate('Welcome');
    }

    setSendersDetails = async () => {
        this.setState({
            spinnerVisible: true,
            spinnerText: 'Loading...'
        });
        let my_user = await AsyncStorage.getItem('@SAM');
        const { user } = JSON.parse(my_user);
    //     let senders_details = user;
    //     senders_details = { _id: user.uid }
        firebaseSvc.findUserById(user.uid, (val) => {
           this.setState({
               spinnerVisible:false,
                sender: val
            });
        })
    }

    getProfileImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            mediaTypes: 'Images'
        });

        if (!result.cancelled) {
            const { sender } = this.state;
            sender.avatar = result.uri;
            this.setState({
                sender
            });
        }
    }

    pickImage = async() => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (status === 'granted') {
            this.getProfileImage();
        } else {
            Alert.alert(
                "Error",
                "We need Permission in other to access camera roll",
                [{
                    text: "Try Again",
                    onPress: () => console.log('OK Pressed')
                }], {
                    cancelable: false
                }
            );
        }
    }

    updateProfile = async() => {
        this.setState({
            spinnerVisible: true,
            spinnerText: 'Updating...'
        });
        const {sender} = this.state;
        await firebaseSvc.editAccount(sender, (data) => {
            if(data.status){
                this.setState({
                    spinnerVisible: false
                });
                setTimeout(() => {
                    Alert.alert(
                        "Success",
                        "User Successfully saved",
                        [
                            {
                                text: "OK",
                                onPress: () => console.log('OK Pressed')
                            }
                        ]
                    );
                }, 1500);
            }else{
                this.setState({
                    spinnerVisible: false
                });
                setTimeout(() => {
                    Alert.alert(
                        "Error",
                        "Couldn't update user.",
                        [{
                            text: "Try Again",
                            onPress: () => console.log('OK Pressed')
                        }], {
                            cancelable: false
                        }
                    );
                }, 1500);
            }
        }).catch((error) => {
                this.setState({
                    spinnerVisible: false
                });
                setTimeout(() => {
                    Alert.alert(
                        "Error",
                        "Please Check your Connection",
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

    _handleChange = (text, name) => {
        const { sender } = this.state;

        sender[name] = text;

        this.setState({sender});
    }

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={this.state.spinnerText}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Header>
                    <Text>
                        Profile
                    </Text>
                </Header>
                <Content>
                    <Body>
                        <Thumbnail large style={styles.formGroup} source={{ uri: this.state.sender.avatar }} />
                        <TouchableOpacity onPress={this.pickImage}>
                            <MaterialIcons size={30} name="edit"/>
                        </TouchableOpacity>
                    </Body>
                    <Form>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.sender.name}
                                // autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Full Name"
                                onChangeText={(text) => this._handleChange(text, 'name')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.sender.email}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="LMU Webmail"
                                onChangeText={(text) => this._handleChange(text, 'email')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.sender.username}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Username"
                                onChangeText={(text) => this._handleChange(text, 'username')}
                            />
                        </Item>
                        <Row>
                            <Left>
                                <TouchableOpacity onPress={() => this.updateProfile()}>
                                    <MaterialCommunityIcons size={30} style={{paddingLeft: 50,}} name="content-save-all" />
                                </TouchableOpacity>
                            </Left>
                            <Right>
                                <TouchableOpacity danger onPress={() => this.logout()}>
                                    <MaterialCommunityIcons size={30} style={{paddingRight: 50,}} name="exit-to-app" />
                                </TouchableOpacity>
                            </Right>
                        </Row>
                    </Form>
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
