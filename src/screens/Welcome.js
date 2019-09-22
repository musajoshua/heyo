import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Title,
    Text,
    Button,
    Card,
    CardItem,
    Row
} from "native-base";
import Spinner from "react-native-loading-spinner-overlay";

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false
        };
    }

    componentDidMount() {
        this.setState({
            spinnerVisible: true
        });
        AsyncStorage.getItem("@SAM").then(value => {
            this.setState({
                spinnerVisible: false
            });
            if (value != null) {
                this.props.navigation.navigate("Contacts");
            }
        });
    }

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={"Loading..."}
                    textStyle={{ color: "#F3F3F3" }}
                />
                <Header>
                    <Body>
                        <Title>Welcome To HEYo</Title>
                    </Body>
                </Header>
                <Content style={{ marginTop: 50 }}>
                    <Card>
                        <CardItem>
                            <Button
                                onPress={() =>
                                    this.props.navigation.navigate("Login")
                                }
                            >
                                <Text>Login</Text>
                            </Button>
                        </CardItem>
                        <CardItem>
                            <Button
                                onPress={() =>
                                    this.props.navigation.navigate("Register")
                                }
                            >
                                <Text>Register</Text>
                            </Button>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}
