import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import { SearchIcon } from '../assets';
import { ResultsDropdown } from './';

const ChannelSearch = ({ setToggleContainer }) => {

  const { client, setActiveChannel } = useChatContext(); 
  const [query, setQuery] = useState('');//initial value of query
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);

  //We want to call this hook everytime the query changes
  useEffect(() => {
    if(!query) {
        setTeamChannels([]);
        setDirectChannels([]);
    }
  }, [query])

  const getChannels = async(text) => { //it is async as we need to wait for the channels to be fetched
    try {
       const channelResponse = client.queryChannels({
           type: 'team',
           name: {$autocomplete: text}, 
           members: {$in: [client.userID]}
       });
       const userResponse = client.queryUsers({
           id: {$ne: client.userID},
           name: {$autocomplete: text}
       });
       //Starting both of the fetching at the same time instead of one by one
       const [channels, {users}] = await Promise.all([channelResponse, userResponse]);
       if(channels.length) setTeamChannels(channels);
       if(users.length) setDirectChannels(users);
    } catch(error) {
        //resetting the search
        setQuery('');
    }
  }
  const onSearch = (event) => {
      event.preventDefault();//to prevent any refreshing on submit
      setLoading(true);
      setQuery(event.target.value);
      getChannels(event.target.value);
  }

  const setChannel = (channel) => {
      setQuery('');
      setActiveChannel(channel);
  }

  return (
    <div className="channel-search__container">
        <div className="channel-search__input__wrapper">
            <div className="channel-search__input__icon">
                <SearchIcon/>
            </div>
            <input 
                type="text"
                className="channel-search__input__text"
                placeholder="Search" 
                value={query} 
                onChange={onSearch}
            />
        </div>
        { query && (
            <ResultsDropdown
                teamChannels={teamChannels}
                directChannels={directChannels}
                loading={loading}
                setChannel={setChannel}
                setQuery={setQuery}
                setToggleContainer={setToggleContainer}
            />
        )}
    </div>
  )
}

export default ChannelSearch