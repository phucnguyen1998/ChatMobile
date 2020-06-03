/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import "./shim.js"
import React, { Component } from 'react';
import { createAppContainer,createStackNavigator,createSwitchNavigator,createBottomTabNavigator } from 'react-navigation';
import JoinRoom from './screens/JoinRoom/index';
import ChatRoom from './screens/ChatRoom/index';

const ChatRoomStack = createStackNavigator(
  {
    JoinRoom,
    ChatRoom
  },
  {
    headerMode: 'none',
    initialRouteName: 'JoinRoom'
  }
);
export default createAppContainer(createSwitchNavigator(
  {
    ChatRoomStack
  }
));

