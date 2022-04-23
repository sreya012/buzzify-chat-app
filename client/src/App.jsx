import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelListContainer, ChannelContainer, Auth } from './components';
import './App.css';
import 'stream-chat-react/dist/css/index.css';

const cookies = new Cookies();

const apiKey = 'bgrctanaxgwm'; //To initialize our 'Chat'
//This authToken will only be available if we are logged in. Based on this variable we will show or hide the form
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

if(authToken) {
  //if we have the token then we will create a user
  //This will connect our user and we will get all his messages
  client.connectUser({
    id : cookies.get('userId'),
    name : cookies.get('username'),
    fullName : cookies.get('fullName'),
    image : cookies.get('avatarURL'),
    hashedPassword : cookies.get('hashedPassword'),
    phoneNumber : cookies.get('phoneNumber'),
  }, authToken)
}

const App = () => {

  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authToken) return <Auth/>

  return (
    <div className="app__wrapper">
      <Chat client={client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setCreateType={setCreateType}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            isEditing={isEditing}
            createType={createType}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
          />
      </Chat>
    </div>
  )
}

export default App