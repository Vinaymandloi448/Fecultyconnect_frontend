/**
 * ChatPage — thin page shell
 *
 * The chat UI will be broken into smaller components:
 *   features/chat/components/ConversationList.jsx
 *   features/chat/components/MessageList.jsx
 *   features/chat/components/MessageInput.jsx
 *   features/chat/components/ChatHeader.jsx
 *
 * This page simply composes them together.
 */

export default function ChatPage() {
  return (
    <div className="flex h-full">
      {/* <ConversationList /> */}
      <div className="flex flex-1 flex-col">
        {/* <ChatHeader /> */}
        {/* <MessageList /> */}
        {/* <MessageInput /> */}
      </div>
    </div>
  );
}
