import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

//useChatContext is called here as a hook
const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type}) => {
  const {channel: activeChannel, client} = useChatContext();
  const ChannelPreview = () => (
      <p className="channel-preview__item">
          #{ channel?.data?.name || channel?.data?.id }
      </p>
  )
  /* channel.state.members = Data we get back is in this format
    {
        '123_uniqueid': {}
        '1234_uniqueid': {}
        '12345_uniqueid': {}
        '123456_uniqueid': {}
    }
    We will convert this data to an array of objects so that we can map through
    client.userID is our ID, we don't want ourselves to be showed in the chat.
  */
  const DirectPreview = () => {
      //We are mapping over all the users and we're keeping all the ones where the id is not equal to the client id which is our ID
      const members = Object.values(channel.state.members).filter(({user}) => user.id !== client.userID);
      return (
          <div className="channel-preview__item single">
              <Avatar 
                image={members[0]?.user?.image} 
                name={members[0]?.user?.fullName} 
                size={24}
              />
              <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
          </div>
      )
  }

  return (
    <div 
        className={channel?.id === activeChannel?.id ? 
                    'channel-preview__wrapper__selected' : 
                    'channel-preview__wrapper'}
        onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
            setActiveChannel(channel);//It will allow us to switch between the channels
            if(setToggleContainer) {
                setToggleContainer((prevState) => !prevState);
            }
        }}
    >
        { type === 'team' ? <ChannelPreview/> : <DirectPreview/> }
    </div>
  )
}

export default TeamChannelPreview