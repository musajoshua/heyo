import React from "react";
import { createAppContainer } from "react-navigation";
import appSwitchNavigator from './src/routes/Routes';
import { Font } from 'expo';

class App extends React.Component {
  componentDidMount = () => {
    Font.loadAsync({
      Roboto_medium: require('./assets/fonts/Roboto-Medium.ttf'),
    });
  };
  
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createAppContainer(appSwitchNavigator);
export default App;