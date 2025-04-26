import { Session, Chatbox } from "@talkjs/react";

function ChatComponent({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  return (
    <Session appId="tVwJ9jhQ" userId={userId}>
      <Chatbox
        conversationId={conversationId}
        style={{ width: "100%", height: "500px" }}
      />
    </Session>
  );
}

export default ChatComponent;
