import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground ,FlatList , AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ChatLineHolder } from './chatLineHolder';
import XMPP from 'stanza.io';
import callApi from './../../utils/API';
import * as config from './../../utils/constants';
import _ from 'lodash';

class ChatRoom extends React.Component {

     constructor(props) {
        super(props);
        this.state = {
            logs: [],
            text : '',
            username : '',
            displayName: '',
            sender:'',
        }
    };

    async componentDidMount() {
        // get username from joinroom
        let username = await AsyncStorage.getItem('name');
        this.setState({username});
        // connect ejabber 
        this.connectServer();
        // get data from sista.api
        callApi(config.GET_USER_INFO+config.USER_1, 'GET', null).then((res)=>{
            //console.log('res', res.data.Name);
            this.setState({
                displayName: res.data.Name
            });
        })

        // get message from sista.api
        callApi(config.GET_MESSAGE + '?from='+config.USER_1+'&to='+config.USER_2+'&type=nomal&pageIndex=1&pageSize=10', 'GET', null).then((res) => {
            const data = res.data.data.map((x,i) => {
                return {text: x.Body, sender: x.From._id, user: x.To._id, displayName: x.From.FirstName}    
            });

            let datachat = [...this.state.logs];
            datachat.push(data)
            datachat = _.flatten(datachat);
            datachat = _.reverse(datachat);
            console.log('data',datachat);
            
            this.setState({logs: datachat});
        })
    }

    addLog = (log) => {
        let {username,sender,logs} = this.state;   
        let msg = [...logs];
        msg.push({user: username, text:log, sender:sender });
        this.setState({logs: msg});
    }

    connectServer() {
        let client = this.state.client = XMPP.createClient({
            jid: config.USER_1+config.HOST,
            password: '123456',
            transport: config.TRANS_PORT,
            wsURL: config.WSURL
        });

        client.on('session:started', () => {
            //this.addLog('session:started');
            client.getRoster();
            client.sendPresence();
        });

        client.on('chat', (msg) => {
            this.setState({sender: msg.from.local});
            this.addLog(msg.body)
        });

        client.on('raw:incoming', (xml) => {
            //this.addLog('xml received: ' + xml);
        });

        client.on('raw:outgoing', (xml) => {
            //this.addLog('xml sent:' + xml);
        });

        client.on('stream:data', (thing) => {
            //this.addLog('stream:data' + thing);
        });

        client.on('connected', () => {
            //this.addLog('connected');
        });

        client.on('disconnected', (xml) => {
            //this.addLog('disconnected ' + Object.keys(xml));
        });

        client.on('connected', (xml) => {
            //this.addLog('connected ' + Object.keys(xml));
        })
        //this.addLog('Client Connected');
        client.connect();

        //this.addLog('Tried connecting to a client');
    }

    sendChat() {
        // API sista -- /api/Dialogue/InsertMessage
        callApi(config.INSERT_MESSAGE + '?from='+config.USER_1+'&to='+config.USER_2+'&type=nomal&subject=teest&body='+this.state.text, 'POST', null).then((res)=>{
            let datachat = [...this.state.logs];
        
            datachat.push({
                text: this.state.text, 
                user: this.state.username,
                sender: '',
                displayName: this.state.displayName,
            });

            this.state.client.sendMessage({
                to: config.USER_2+config.HOST,
                body: this.state.text
            });

            this.addLog(this.state.text);
            this.setState({
                text: "",
                logs: datachat
            });
        });
    }
    
    logOut = () =>{
        this.props.navigation.goBack();
    }

    _renderChatLine = (item) =>
    {
        //&& item.sender !== this.state.username    
        if(item.sender && item.sender !== '' && this.state.username !== item.sender)
        {
            return(
                //you
                <ChatLineHolder sender={item.displayName} chatContent={item.text} />
            );
        }

        return(
            //me
            <View style={{ alignItems: 'flex-end' }} >
                <ChatLineHolder sender={item.displayName} chatContent={item.text} />
            </View>
        );
    };

    render() { 
        console.log('log', this.state.logs);
        
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }} >
                <ImageBackground 
                    imageStyle={{ opacity: 0.4 }} 
                    style={{ flex: 9 / 10, 
                    backgroundColor: '#A5A5A5', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-end' }} 
                    source={require('../../background.jpg')}
                >
                    <View 
                        style={{width: '100%', 
                        height: 50,
                        backgroundColor:'white', 
                        flexDirection: 'row', 
                        justifyContent:'space-between', 
                        alignItems:'center', 
                        paddingHorizontal: 15}}
                    >
                        <Text>{this.state.displayName}</Text>
                        <TouchableOpacity onPress={this.logOut}>
                            <Text>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList 
                        data={this.state.logs} 
                        renderItem={({item}) => this._renderChatLine(item)} 
                        keyExtractor={(item, index) => index.toString()}
                    />
        

                </ImageBackground>
                <View style={{ flex: 1 / 10 }} >
                    <View style={{
                        flexDirection: 'row', 
                        backgroundColor: '#FFF',
                        width: '100%', 
                        height: '100%', 
                        justifyContent: 'space-around', 
                        alignItems: 'center', 
                        marginLeft: 2
                    }}>
                        <View style={{flex : 9/10}} >
                            <TextInput 
                                placeholder="Nhập nội dung chat" 
                                value={this.state.text}
                                onChangeText={(text) => this.setState({text})}
                                style={{ height: 100, fontSize: 18 }} 
                            />
                        </View>
                        <View style={{flex : 1/10}} >
                            <TouchableOpacity 
                                onPress={() => this.sendChat()} 
                            >
                                <Text style={{ color: '#0099ff', fontSize: 14, marginRight: 15 }} >
                                    Gửi
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
};

export default ChatRoom;