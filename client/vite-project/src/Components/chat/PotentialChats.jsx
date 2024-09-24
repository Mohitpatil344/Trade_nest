import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat } = useContext(ChatContext);

  if (!user || !potentialChats || !createChat) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  return (
    <div className="all-users">
      {potentialChats.map((u, index) => (
        <div
          className="single-user"
          key={index}
          onClick={() => createChat(user._id, u._id)}
        >
          {u.name}
          <span className="user-online"></span>
        </div>
      ))}
    </div>
  );
};

export default PotentialChats;
