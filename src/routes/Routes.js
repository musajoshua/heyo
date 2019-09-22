import React from 'react';

import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import Login from './../screens/Login';
import Register from './../screens/Register';
import Welcome from './../screens/Welcome';

import Contacts from '../screens/Contacts';
import Chat from './../screens/Chat';
import Profile from '../screens/Profile';
import AddContact from './../screens/AddContact';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const appStackNavigator = createStackNavigator({
    Welcome : Welcome,
    Login : Login,
    Register : Register
});

const chatStackNavigator = createStackNavigator({
    Contacts : Contacts,
    Chat : Chat,
    AddContact : AddContact
});

chatStackNavigator.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: navigation.state.index === 0,
    };
};

const appBottomTabNavigator = createBottomTabNavigator({
    Contacts: chatStackNavigator,
    Profile : Profile
},
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = MaterialCommunityIcons;
                let iconName;
                if (routeName === 'Contacts') {
                    iconName = `comment-multiple-outline`;
                } else if (routeName === 'Profile') {
                    iconName = `account`;
                }
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        })
    }
)

const appSwitchNavigator = createSwitchNavigator({
    Welcome : appStackNavigator,
    Chat : appBottomTabNavigator
});

export default appSwitchNavigator;