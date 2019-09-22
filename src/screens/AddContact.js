import React, { Component } from 'react';
import { Alert, AsyncStorage} from 'react-native';
import firebasesvc from './../config';
import {
    Container,
    Item,
    Input,
    Header,
    Icon,
    Button,
    Text,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

export default class AddContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            user : {
                email: ''
            },
            sender : {},
            contacts : []
        }
    }

    static navigationOptions = {
        title: 'Add Contact',
    };

    componentDidMount = async() => {
        await this.setSendersDetails();
    }

    setSendersDetails = async () => {
        let my_user = await AsyncStorage.getItem('@SAM');
        const { user } = JSON.parse(my_user);
        let senders_details = user;
        senders_details = { _id: user.uid, email : user.email }
        this.setState({
            sender: senders_details
        });
    }

    _handleChange = (data, name) => {
        const { user } = this.state;
        user[name] = data;

        this.setState({
            ...this.state,
            user
        });
    }

    findUser = async() => {
        this.setState({
            spinnerVisible: true
        });
        const { user, sender } = this.state;

        if(user.email != sender.email){
            firebasesvc.findByEmail(user,
                (val) => {
                    this.setState({
                        spinnerVisible: false
                    });
                    if(val.length  == 1){
                        this.props.navigation.navigate("Chat", val[0]);
                    }else{
                        setTimeout(() => {
                            Alert.alert(
                                "Error",
                                "Email doesnt Exist", 
                                {
                                    cancelable: false
                                }
                            );
                        }, 1500);
                    }
                });
        }else{
            this.setState({
                spinnerVisible: false
            });
            Alert.alert(
                "Error",
                "You can't add yourself",
                [
                    {
                        text : 'OK',
                        onPress: () => console.log('Cancel Pressed')
                    }
                ]
            );
        }

    }

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Loading...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input
                            onSubmitEditing={ () => this.findUser() }
                            placeholder="Search By Email" 
                            value={this.state.user.email}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(text) => this._handleChange(text, 'email')}
                        />
                        <Icon name="ios-people" />
                    </Item>
                    <Button transparent onPress={() => this.findUser()}>
                        <Text>Search</Text>
                    </Button>
                </Header>
            </Container>
        );
    }
}
