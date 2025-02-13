import React, { useEffect } from "react";
import SVG from "../lib/SVGs/SVG";

interface ChatsectionProps {
  showSidebar: any;
  activeIndex: any;
  handleBack: any;
  isMobile: boolean;
  chatContainerRef: any;
  allMessages: any;
  nickname: any;
  senderMessage: any;
  setSenderMessages: any;
  setSenderMessage: any;
  sendMessage: any;
  
}
const ChatSection: React.FC<ChatsectionProps> = ({
  showSidebar,
  activeIndex,
  handleBack,
  isMobile,
  nickname,
  senderMessage,
  setSenderMessages,
  chatContainerRef,
  allMessages,
  setSenderMessage,
  sendMessage,

}) => {
  // useEffect(() => {
  //         setAllMessages([...senderMessages, ...receiverMessages]);
  //     }, [senderMessages, receiverMessages]);
  return (
    <section
      className={`flex-1 flex flex-col h-screen bg-gray-50 ${
        !showSidebar ? "block" : "hidden md:flex"
      }`}
    >
      {activeIndex ? (
        <>
          {/* Chat header */}
          <div className="bg-white border-b px-4 py-3 flex items-center">
            {isMobile && (
              <button onClick={handleBack} className="mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="assets/avatar2.png"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">{activeIndex}</p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <SVG.SearchIcon />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <SVG.ThreeDotMenu />
                </button>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-6"
            ref={chatContainerRef}
          >
            {allMessages
              .sort(
                (a: any, b: any) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              )
              .map((msg: any, index: any) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.senderId === nickname ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-lg ${
                      msg.senderId === nickname
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
          </div>

          {/* Message input */}
          <div className="p-4 bg-white border-t">
            <div className="relative">
              <input
                value={senderMessage}
                onChange={(e) =>
                  setSenderMessage(e.target.value.slice(0, 1200))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (senderMessage?.trim()) {
                      setSenderMessages((prevData: any) => [
                        ...prevData,
                        {
                          content: senderMessage,
                          timestamp: new Date(),
                          senderId: nickname,
                        },
                      ]);
                      sendMessage();
                      setSenderMessage("");
                    }
                  }
                }}
                className="w-full border rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:border-blue-500"
                placeholder="Type a message..."
              />
              <button className="absolute left-4 top-1/2 -translate-y-1/2">
                <SVG.EmojiIcon />
              </button>
              <button
                onClick={() => {
                  if (senderMessage?.trim()) {
                    setSenderMessages((prevData: any) => [
                      ...prevData,
                      {
                        content: senderMessage,
                        timestamp: new Date(),
                        senderId: nickname,
                      },
                    ]);
                    sendMessage();
                    setSenderMessage("");
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <SVG.SendIcon />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-500">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </section>
  );
};

export default ChatSection;
