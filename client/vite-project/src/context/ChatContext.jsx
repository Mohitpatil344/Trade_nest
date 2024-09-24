import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]); 
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  console.log("currentChat:", currentChat);
  console.log("messages:", messages);

  // Fetch potential chats when userChats or user changes
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await getRequest(`${baseUrl}/users`);
        if (response.error) {
          console.error("Error fetching users:", response.error);
          return;
        }

        const pChats = response.filter((u) => {
          if (user?._id === u._id) return false;
          if (userChats) {
            return !userChats.some((chat) => chat.members.includes(u._id));
          }
          return true;
        });
        setPotentialChats(pChats);
      } catch (error) {
        console.error("Error in getUsers:", error);
      }
    };
    getUsers();
  }, [userChats, user]);

  // Fetch user chats when user changes
  useEffect(() => {
    let isMounted = true;
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        try {
          const response = await getRequest(
            `${baseUrl}/chat/chats/${user._id}`
          );
          if (isMounted) {
            if (response.error) {
              console.error("Error fetching user chats:", response.error);
              setUserChatsError(response.error);
              return;
            }
            setUserChats(response);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error in getUserChats:", error);
            setUserChatsError("An error occurred while fetching chats.");
          }
        } finally {
          if (isMounted) {
            setIsUserChatsLoading(false);
          }
        }
      }
    };
    getUserChats();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch messages for the current chat when currentChat changes
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat || !currentChat._id) return;

      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await getRequest(
          `${baseUrl}/messages/${currentChat._id}`
        );

        if (response.error) {
          setMessagesError(response);
          return;
        }

        setMessages(response);
      } catch (error) {
        setMessagesError("An error occurred while fetching messages.");
      } finally {
        setIsMessagesLoading(false);
      }
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something");
      if (!currentChatId) {
        console.log("Current Chat ID is missing");
        return;
      }
  
      // Log the message data to verify the payload
      console.log("Sending message:", {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        setSendTextMessageError(response.error);
      } else {
        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
      }
    },
    [setMessages]
  );

  // Update the current chat
  const updateCurrentChat = useCallback((chat) => {
    console.log("Updating current chat:", chat);
    setCurrentChat(chat);
  }, []);

  // Create a new chat
  const createChat = useCallback(async (firstId, secondId) => {
    if (!firstId || !secondId) {
        console.error("firstId and secondId are required");
        return;
    }

    try {
        const response = await postRequest(
            `${baseUrl}/chat`,  // Endpoint for creating a chat
            JSON.stringify({ firstId, secondId }) // Ensure these IDs are correct and not undefined
        );
        if (response.error) {
            console.error("Error creating chat:", response.error);
            return;
        }
        setUserChats((prevChats) => [...prevChats, response]); // Update user chats state
    } catch (error) {
        console.error("Error in createChat:", error);
    }
}, []);


  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        newMessage,

        sendTextMessageError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
