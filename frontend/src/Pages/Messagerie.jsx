import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";
import NavigationBar from '../Components/NavigationBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`;

const MessagesContainer = styled.div`
  flex: 2;
  padding: 20px;
`;

const DiscussionsContainer = styled.div`
  flex: 1;
  padding: 20px;
  border-right: 1px solid #ccc;
`;

const DiscussionItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
`;

const ChatContainer = styled.div`
  flex: 2;
  padding: 20px;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
  background-color: ${(props) => (props.isMe ? '#007bff' : '#f1f0f0')};
  color: ${(props) => (props.isMe ? 'white' : 'black')};
  border-radius: ${(props) => (props.isMe ? '15px 15px 0 15px' : '15px 15px 15px 0')};
  padding: 10px 15px;
  max-width: 70%;
  align-self: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
`;

const SelectInput = styled.select`
  margin-bottom: 10px;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
`;

const Messagerie = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100 millisecondes

        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': document.querySelector("#token").textContent,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching users');
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
    
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100 millisecondes

        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/groupsmember', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': document.querySelector("#token").textContent,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching group members');
        }

        const data = await response.json();
        setDiscussions(data.memberGroups); 
      } catch (error) {
        console.error('Error fetching group members:', error.message);
      }
    };
    
    fetchGroupMembers();
  }, []);

  const fetchGroupMembers = async (groupId) => {
    try {
      const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/mygroups/${groupId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching group members');
      }
  
      const data = await response.json();
      return data.groupMembers;
    } catch (error) {
      console.error('Error fetching group members:', error.message);
      return [];
    }
  };
  
  const getOtherUserId = async (groupId, myUserId) => {
    try {
      const groupMembers = await fetchGroupMembers(groupId);
  
      for (const member of groupMembers) {
        if (member.id != myUserId) {
          return member.id;
        }
      }
  
      return null;
    } catch (error) {
      console.error('Error getting other user ID:', error.message);
      return null;
    }
  };

  const handleSelectDiscussion = async (discussion) => {
    setSelectedDiscussion(discussion);
    try {
      const otherUserId = await getOtherUserId(discussion.id, document.querySelector("#idUser").textContent);
      if (otherUserId) {
        setSelectedUser(otherUserId);
      }
  
      // const articleDetails = await fetchArticleDetails(discussion.articleId); // Récupérer les détails de l'article
      // console.log(articleDetails);
  
      const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/messages/${discussion.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching messages for selected discussion');
      }
  
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages for selected discussion:', error.message);
    }
  };

  const fetchArticleDetails = async (articleId) => {
    try {
      const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/items/${articleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching article details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching article details:', error.message);
      return null;
    }
  };

  const handleMessageSend = async () => {
    try {
      console.log(selectedDiscussion)
        const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/messages/${selectedDiscussion.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': document.querySelector("#token").textContent,
            },
            body: JSON.stringify({ content: newMessage }),
        });

        if (!response.ok) {
            throw new Error('Error sending message');
        }

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, data.message]);
        setNewMessage('');
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
    try {
      const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/messages/${selectedDiscussion.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching discussion messages');
      }
  
      const data = await response.json();
      setMessages(data.messages); // Met à jour les messages dans l'état local
    } catch (error) {
      console.error('Error fetching discussion messages:', error.message);
    }
};

  return (
    <Container>
      <NavigationBar />
      <MainContainer>
        <DiscussionsContainer>
          <h2>Discussions</h2>
          {discussions.map((discussion, index) => (
            <DiscussionItem key={index} onClick={() => handleSelectDiscussion(discussion)}>
              {discussion.name} - {discussion.articleId}
            </DiscussionItem>
          ))}
        </DiscussionsContainer>
        <ChatContainer>
          <h2>Messages</h2>
          <MessagesContainer>
            {messages.map((message, index) => (
             <MessageItem
             key={index}
             isMe={message.uid == document.querySelector("#idUser").textContent} // Comparaison avec l'ID de l'utilisateur actuel
           >
             {message.content}
           </MessageItem>
            ))}
          </MessagesContainer>
          <TextInput
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <SendButton onClick={handleMessageSend}>Send</SendButton>
        </ChatContainer>
      </MainContainer>
    </Container>
  );
};

export default Messagerie;
