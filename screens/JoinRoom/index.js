import React from 'react';
import { View, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import callApi from './../../utils/API';
import * as config from './../../utils/constants';
import firebase from 'firebase';
import DeviceInfo from 'react-native-device-info';

class JoinRoom extends React.Component {
    static navigationOptions = {
        title: 'Welcome to Chat',
    };
    state = {
        name : '',
        password: ''
    };

    _onChangeName = (text) =>
        {
            this.setState({
                name : text
            });
        };

    _onChangePass = (password) => {
        this.setState({
            password: password
        });
    }

    _toChatRoom = async () => {
        // firebase
        // firebase.auth().signInAnonymously().then((user) => {
        //     AsyncStorage.setItem('name',this.state.name);
        //     this.props.navigation.navigate('ChatRoom');
        // }).catch( (err) => alert(err) );

        const DeviceModel = await DeviceInfo.getModel()
        const DeviceBrand = await DeviceInfo.getBrand()
        const OsCode = await DeviceInfo.getBaseOs();
        const DeviceName = await DeviceInfo.getDeviceName();
        const DeviceCode = await DeviceInfo.getCodename();
        const AppVersion = await DeviceInfo.getVersion();
        const AppCode = await DeviceInfo.getApplicationName();

        callApi(config.LOGIN+'?emailOrPhone='+this.state.name+'&password='+this.state.password+'&remember=true', 'POST', {
            "Ts": Date.now,
            "DeviceCode": DeviceCode,
            "DeviceName": DeviceName,
            "UserId": "",
            "OsCode": OsCode,
            "AppVersion": AppVersion,
            "DeviceBrand": DeviceBrand,
            "DeviceModel": DeviceModel,
            "FcmToken": ""
        }).then(()=>{
            AsyncStorage.setItem('name',config.USER_1);
            this.props.navigation.navigate('ChatRoom');
        })
    }
    
    render() {
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10, paddingBottom: 15 }} >
                <Text>
                    Nhập tên :
                </Text>
                <TextInput placeholder="User Name" style={{
                    borderColor: "#A5A5A5",
                    borderWidth: 0.5, padding: 8, width: '100%', marginBottom: 15, marginTop: 15
                    }} 
                    onChangeText={this._onChangeName}
                />

                <Text>
                    Nhập Password :
                </Text>
                <TextInput 
                    secureTextEntry
                    placeholder="Password" 
                    style={{
                    borderColor: "#A5A5A5",
                    borderWidth: 0.5, padding: 8, width: '100%', marginBottom: 15, marginTop: 15
                    }} 
                    onChangeText={this._onChangePass}
                />
                <TouchableOpacity onPress={() => this._toChatRoom()} >
                    <Text style={{ fontWeight: 'bold' }} >
                        Join Now
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
};
export default JoinRoom;