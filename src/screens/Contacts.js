import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { Container, ListItem, List, Content, Text, Icon as NativeIcon, Thumbnail, Body, Right, Left, Button} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebaseSvc from './../config';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            contacts: []
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Chats',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate("AddContact")}>
                <Ionicons name="md-person-add" size={30} style={{ paddingRight: 20 }} />
            </TouchableOpacity>
        ),
    });

    componentDidMount  = async() => {
        await this.loadContacts();
        this.props.navigation.addListener('willFocus', () => {
            this.setState({
                contacts: []
            })
            this.loadContacts();
        });
    }
    

    loadContacts = async () => {
        this.setState({
            spinnerVisible: true,
        });
        let my_user = await AsyncStorage.getItem('@SAM');
        let { user } = JSON.parse(my_user);
        let my_id = user.uid;
        await firebaseSvc.retreiveAllContacts(user.uid, async (res) => {
            const all_contacts = await res;
            this.setState({
                spinnerVisible: false,
                contacts : []
            });
            for (i = 0; i < all_contacts.length; i++) {
                firebaseSvc.findUserById(all_contacts[i], async(user) => {
                    let val = await firebaseSvc.getLastMessage(user.uid, my_id);
                    const { createdAt: numberStamp, text} = val.val();
                    const createdAt = new Date(numberStamp);
                    const last_message = {createdAt, text};
                    user.last_message = last_message;
                    this.setState(previousState => ({
                        contacts: [
                            ...previousState.contacts,
                            user
                        ]
                    }));
                });
            };
        });
    }

    render() {
        const contacts = this.state.contacts.map((contact) =>
            <ListItem avatar key={contact.uid} onPress={() => this.props.navigation.navigate("Chat", contact)}>
                <Left>
                    <Thumbnail small source={{ uri: contact.avatar }} />
                </Left>
                <Body>
                    <Text>{contact.name}</Text>
                    <Text note>{contact.last_message.text}</Text>
                </Body>
                <Right>
                    <NativeIcon small style={{ color: '#0B60FF'}} name="arrow-forward" />
                    <Text note>{contact.last_message.createdAt.getHours() + ":" + contact.last_message.createdAt.getMinutes()}</Text>
                </Right>
            </ListItem>
        )
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Loading Contacts...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Content>
                    <List>
                        {contacts}
                    </List>
                </Content>
            </Container>
        );
    }
}
