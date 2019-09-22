import React, { Component } from 'react';
import { AsyncStorage ,TouchableOpacity, StyleSheet, WebView, Alert} from 'react-native';
import firebaseSvc from './../config';
import { GiftedChat, Bubble} from 'react-native-gifted-chat';
import { Container, Text, View } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { DocumentPicker } from 'expo';
import {Ionicons} from '@expo/vector-icons';
import Lightbox from 'react-native-lightbox';
import uuid from 'uuid';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            messages: [],
            receiver : {},
            sender : {}
        };
    }

    static navigationOptions = ({ navigation }) => ({
        
        title: navigation.getParam('name'),
        headerRight: (
            <TouchableOpacity>
                <Ionicons name="ios-add" size={30} style={{ paddingRight: 20 }} onPress={() => navigation.state.params.getDocuments()}/>
            </TouchableOpacity>
        ),
    });

    messageIdGenerator = () => {
        return uuid.v4();
    }

    setSendersDetails = async() => {
        let my_user = await AsyncStorage.getItem('@SAM');
        const { user } = JSON.parse(my_user);
        const { uid, email, avatar, name} = user;
        senders_details = { _id : uid ,email, avatar, name}
        this.setState({
            sender: senders_details
        }, () => console.log(this.state.sender));
    }
    
    setReceiversDetails = async() => {
        let { name, avatar, uid, email } = this.props.navigation.state.params;
        let receiver_details = { name, avatar, uid, email };
        this.setState({
            receiver: receiver_details
        });
    }

    componentDidMount = async () => {
        this.setState({
            spinnerVisible : true
        });
        await this.setReceiversDetails();
        await this.setSendersDetails();
        firebaseSvc.retreive(this.state.sender._id, this.state.receiver.uid, (messages) => {
            this.setState(previousState => ({
                spinnerVisible : false,
                messages: GiftedChat.append(previousState.messages, messages),
            }));
        });
        this.setState({
            spinnerVisible: false
        });
        this.props.navigation.setParams({
            getDocuments: this.getDocuments
        })
    }

    onSend(messages) {
        const { text, user , _id} = messages[0];
        let message = { _id, createdAt: new Date().getTime(), text, user};
        firebaseSvc.openConversation(this.state.sender._id, this.state.receiver.uid, message);
    }

    getDocuments = async() => {
        let result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
        });

        if (!result.cancelled) {

            firebaseSvc.uploadFile(result.uri)
            .then((val) => {
                const message = {};
                message._id = this.messageIdGenerator();
                message.createdAt = new Date().getTime();
                message.user = this.state.sender;
                message.text = result.name;
                message.file = val;
                firebaseSvc.openConversation(this.state.sender._id, this.state.receiver.uid, message);
            })
            .catch((error) => {
                Alert.alert(
                    "Error",
                    error,
                    [{
                        text: "Try Again",
                        onPress: () => console.log('OK Pressed')
                    }], {
                        cancelable: false
                    }
                )
            });
        }
    }

    renderFile = props =>{
        if(props.currentMessage.file){
            return(
                <Lightbox>
                    <WebView
                        style={styles.pdf}
                        source={{uri: props.currentMessage.file}}
                    />
                </Lightbox>
            );
        }
    }
    renderBubble = props => {
        return (
            <View>
                {this.renderFile(props)}
                <Bubble {...props} />
            </View>
        );
    };

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Loading Messages...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <GiftedChat
                    isAnimated={true}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.sender}
                    showAvatarForEveryMessage
                    messageIdGenerator={this.messageIdGenerator}
                    renderBubble={this.renderBubble}
                />
            </Container>
        );
    }
}

export default Chat;

const styles = StyleSheet.create({
    container: {},
    pdf: {
        width: "100%",
        height: 150,
        borderRadius: 13,
        margin: 3,
    }
});
