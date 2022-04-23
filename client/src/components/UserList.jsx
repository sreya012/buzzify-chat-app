import React, { useState, useEffect } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';// we will query the users from this useChatContext
import { InviteIcon } from '../assets';

//all react functional components have access to a specific prop called children
//children will contain all the components passed to the ListContainer
const ListContainer = ({children}) => {
  return (
      <div className="user-list__container">
          <div className="user-list__header">
              <p>User</p>
              <p>Invite</p>
          </div>
          {children}
      </div>
  )
}

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);
  const handleSelect = () => {
      if(selected) {
          //we are keeping all of the selected users so far, but removing the one we have click right now
          setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
      } else {
          setSelectedUsers((prevUsers) => [...prevUsers, user.id]);//spreading all the prevUsers and adding the one just clicked
      }
      setSelected((prevSelected) => !prevSelected);
  }

  return (
      <div className="user-item__wrapper" onClick={handleSelect}>
          <div className="user-item__name-wrapper">
              <Avatar image={user.image} name={user.fullName || user.id} size={32} />
              <p className="user-item__name">{user.fullName || user.id}</p>
          </div>
          { selected ? <InviteIcon/> : 
            <div className="user-item__invite-empty"></div>
          }
      </div>
  )
}

const UserList = ({setSelectedUsers}) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  //We call this hook when we want to perform an action when something changes(here the something is filters = users for Channel Messages/Direct Messages)
  useEffect(() => {
    const getUsers = async () => {
        if(loading) return;
        setLoading(true);
        try {
             //excluding us
            const response = await client.queryUsers(
                {id: {$ne: client.userID}},
                {id: 1},
                {limit: 8}
            );
            if(response.users.length) {
                setUsers(response.users)
            } else {
                setListEmpty(true);
            }
        } catch(error) {
            setError(true);
        }

        setLoading(false);
    }
    //Only if we are connected we will call getUsers()
    if(client) {
        getUsers();
    }
  }, [])

  if(error) {
      return (
          <ListContainer>
            <div className="user-list__message">
                Error loading, please refresh and try again.
            </div>
          </ListContainer>
      )
  }
  if(listEmpty) {
    return (
        <ListContainer>
          <div className="user-list__message">
              No users found.
          </div>
        </ListContainer>
    )
}

  return (
    <ListContainer>
       {loading ? <div className="user-list__message">
           Loading users...
            </div> : (
            users?.map((user, i) => (
                <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers}/>
            ))
       )}
    </ListContainer>
  )
}

export default UserList