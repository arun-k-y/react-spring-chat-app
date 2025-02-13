// "use client";

// import { useSearchParams } from "next/navigation";
// import SockJS from "sockjs-client";
// import { useEffect, useRef, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import Stomp from "stompjs";
// import { useRouter } from "next/navigation";
// import SVG from "../lib/SVGs/SVG";
// import CardBox from "../components/Menu";
// import Menu from "../components/Menu";

// interface User {
//   nickName: string;
//   realName: string;
//   status: string;
// }

// const baseURL = "http://localhost:8080";

// // const baseURL = "https://ethereal-anthem-446819-c6.df.r.appspot.com";

// // const baseURL = "https://chat-app-devv-aef7f6dfe4d9.herokuapp.com"

// export default function Chat() {
//   const searchParams = useSearchParams();

//   const nickname = searchParams?.get("nickname");
//   const realName = searchParams?.get("realName");

//   const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
//   const [senderMessage, setSenderMessage] = useState("");

//   const [activeIndex, setActiveIndex] = useState<String | null>(null);

//   const [senderMessages, setSenderMessages] = useState<any>([]);

//   const [receiverMessages, setReceiverMessages] = useState<any>([]);

//   const [allMessages, setAllMessages] = useState<any>([]);

//   const chatContainerRef = useRef<any>(null);

//   const router = useRouter();

//   const [stompClient, setStompClient] = useState<any>(null);
//   const socket = new SockJS(`${baseURL}/ws`);

//   const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen); // Toggle menu visibility
//   };

//   const handleMenuItemClick = (item: { label: any }, index: any) => {
//     console.log("Clicked:", item.label);
//     // Add your click handling logic here
//     // For example, close the menu after clicking an item
//     setMenuOpen(false);
//   };

//   const connectToWebSocket = () => {
//     const stomp = Stomp.over(socket);

//     stomp.connect(
//       {},
//       () => {
//         console.log("WebSocket connected");
//         toast.success("Connected successfully!");
//         setStompClient(stomp);

//         subscribeToUserTopics(stomp);

//         if (nickname && realName) {
//           saveUser(nickname, realName, stomp);
//         } else {
//           console.error("Nickname or realName is null or undefined");
//         }

//         //find and display online users
//         findAndDisplayConnectedUsers();

//         // resolve(stomp);
//       },
//       (error: any) => {
//         console.error("WebSocket connection error:", error);
//       }
//     );
//   };

//   const disconnectFromWebSocket = () => {
//     if (stompClient) {
//       if (nickname && realName) {
//         console.log("stompppppppp", stompClient);
//         stompClient.send(
//           "/app/user.disconnectUser",
//           {},
//           JSON.stringify({
//             nickName: nickname,
//             fullName: realName,
//             status: "OFFLINE",
//           })
//         );
//       }
//       stompClient.disconnect();
//       setStompClient(null); // Set stompClient to null after disconnecting
//     }
//   };

//   useEffect(() => {
//     connectToWebSocket();

//     // Clean up the WebSocket connection when the component unmounts
//     return () => {
//       disconnectFromWebSocket();
//     };
//   }, [nickname, realName]);

//   useEffect(() => {
//     setAllMessages([...senderMessages, ...receiverMessages]);
//   }, [senderMessages, receiverMessages]);

//   const subscribeToUserTopics = (stomp: any) => {
//     const userId = nickname;
//     const topic1 = `/user/${userId}/topic`;

//     const topic2 = `/user/${userId}/queue/messages`;

//     stomp.subscribe(topic1, (message: any) => {
//       const user: User = JSON.parse(message.body);
//       console.log("Received user object from server:", user);
//     });

//     stomp.subscribe(topic2, async (message: any) => {
//       await findAndDisplayConnectedUsers();

//       const receivedFrame = JSON.parse(message.body);
//       const content = receivedFrame.content;

//       const timestamp = receivedFrame.timestamp;

//       const senderId = receivedFrame.senderId;

//       setReceiverMessages((prevData: any) => {
//         return [
//           ...prevData,
//           { content: content, timestamp: timestamp, senderId: senderId },
//         ];
//       });
//     });
//   };

//   function LogoutUser() {
//     disconnectFromWebSocket();
//     router.push("/");
//   }

//   async function findAndDisplayConnectedUsers() {
//     const connectedUsrsResponse = await fetch(`${baseURL}/users`);
//     const connectedUsrs: User[] = await connectedUsrsResponse.json();
//     const filteredUsers: User[] = connectedUsrs.filter(
//       (user: User) => user.nickName !== nickname
//     );
//     setConnectedUsers(filteredUsers);
//     console.log("filtered users", filteredUsers);
//   }

//   async function fetchAndDisplayUserChat(selectedUserId: string) {
//     setSenderMessages([]);
//     setReceiverMessages([]);
//     const userChatResponse = await fetch(
//       `${baseURL}/messages/${nickname}/${selectedUserId}`
//     );
//     const userChat = await userChatResponse.json();
//     userChat?.forEach((chat: any) => {
//       if (chat.senderId === selectedUserId) {
//         setReceiverMessages((prevData: any) => {
//           return [
//             ...prevData,
//             {
//               content: chat.content,
//               timestamp: chat.timestamp,
//               senderId: chat.senderId,
//             },
//           ];
//         });
//       } else {
//         setSenderMessages((prevData: any) => {
//           return [
//             ...prevData,
//             {
//               content: chat.content,
//               timestamp: chat.timestamp,
//               senderId: chat.senderId,
//             },
//           ];
//         });
//       }

//       console.log(
//         "chat.senderId, chat.content, chat.timestamp, chat.senderId",
//         chat.senderId,
//         chat.content,
//         chat.timestamp,
//         chat.senderId
//       );
//     });
//     console.log("user chattttt : ", userChat);
//   }

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [allMessages]);

//   const sendMessage = () => {
//     if (senderMessage.trim() !== "") {
//       const chatMessage = {
//         senderId: nickname,
//         recipientId: activeIndex,
//         content: senderMessage,
//         timestamp: new Date(),
//       };

//       console.log("stomp client in send message function ", stompClient);

//       stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
//     }
//   };

//   const saveUser = (nickname: string, realName: string, stomp: any) => {
//     if (stomp) {
//       setStompClient(stomp);
//       if (nickname && realName) {
//         console.log("stompppppppp", stomp);
//         stomp.send(
//           "/app/user.addUser",
//           {},
//           JSON.stringify({
//             nickName: nickname,
//             fullName: realName,
//             status: "ONLINE",
//           })
//         );
//       } else {
//         console.error("Nickname or realName is null");
//       }
//     } else {
//       console.error("Stomp client is null");
//     }
//   };

//   return (
//     <main className="flex h-screen w-full">
//       {/*Online members section */}
//       <section className="bg-[#FFFFFF] h-screen w-full md:w-[20vw] overflow-scroll ">
//         <div className="py-4 px-2 border-b text-[#707991] text-2xl items-center flex justify-between">
//           <div className="font-black">Online Members</div>
//           <div className="flex gap-2 items-center">
//             <button>
//               <SVG.SearchIcon />
//             </button>

//             <div className="relative md:hidden items-center flex">
//               <button onClick={toggleMenu}>
//                 <SVG.ThreeDotMenu />
//               </button>

//               {menuOpen && (
//                 <div className="absolute top-4 right-4 left ">
//                   <Menu onClickLogout={LogoutUser} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {/**chats section mobile view  */}

//         {connectedUsers.map((user) => (
//           <div
//             key={user.nickName}
//             className={`px-4 py-3 flex gap-4 cursor-pointer items-center hover:bg-[#F5F5F5] transition duration-300 ${
//               activeIndex === user.nickName ? "bg-[#F5F5F5]" : "bg-none"
//             }`}
//             onClick={() => {
//               setActiveIndex(user.nickName);
//               fetchAndDisplayUserChat(user.nickName);
//             }}
//           >
//             <div className="w-12 h-12">
//               <img src="assets/avatar1.png" alt="" />
//             </div>

//             <div className="grid">
//               <p className=" text-[#011627] font-semibold text-base truncate">
//                 {user.nickName}
//               </p>
//               <p className=" text-[#707991] truncate">How are you? </p>
//             </div>
//           </div>
//         ))}

//         <div className="absolute bottom-1 px-1 w-full max-md:hidden md:w-[20vw] ">
//           <button
//             onClick={() => {
//               LogoutUser();
//             }}
//             className="text-center w-full bg-blue-700 hover:bg-blue-900 transition  duration-500 text-white rounded-md px-4 py-3"
//           >
//             Logout
//           </button>
//         </div>
//       </section>

//       {/*Chats section */}
//       <section
//         className={`bg-[#8BABD8] h-screen w-[80vw] hidden md:flex md:flex-col ${
//           !activeIndex ? "justify-center" : ""
//         }`}
//       >
//         {activeIndex ? (
//           <>
//             <div className="absolute top-0 bg-white w-[80vw] border-l py-3 px-4">
//               <div className="flex">
//                 <div className="w-10 h-10">
//                   <img src="assets/avatar2.png" />
//                 </div>
//                 <div className="grid ml-4">
//                   <p className=" text-[#011627] font-semibold text-sm truncate">
//                     {activeIndex}
//                   </p>
//                   <p className=" text-[#707991] text-xs font-normal truncate">
//                     Last seen 5min ago{" "}
//                   </p>
//                 </div>

//                 <div className="flex items-center ml-auto">
//                   <div className="mr-4">
//                     <SVG.SearchIcon />
//                   </div>
//                   <div>
//                     <SVG.ThreeDotMenu />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* chat container */}
//             <div
//               className="overflow-scroll mt-16 mb-24 mx-20"
//               ref={chatContainerRef}
//             >
//               {/* {allMessages.map((message:any, index:any) => (
//             <div key={index} className="flex justify-end mt-2 mb-2">
//               <div className="bg-blue-500 font-sans text-white rounded-lg py-2 px-3">
//                 {message.content}
//               </div>
//             </div>
//           ))} */}

//               {allMessages
//                 .sort(
//                   (a: any, b: any) =>
//                     new Date(a.timestamp).getTime() -
//                     new Date(b.timestamp).getTime()
//                 )
//                 .map((msg: any, index: any) => (
//                   <div
//                     key={index}
//                     className={`mt-2 mb-2  ${
//                       msg.senderId === nickname
//                         ? "flex justify-end items-center"
//                         : "flex justify-start"
//                     }`}
//                   >
//                     {/* {msg.senderId !== nickname && (
//                       <span className="mr-2 text-gray-500">
//                         {activeIndex}:{" "}
//                       </span>
//                     )} */}
//                     <div
//                       className={`max-w-[47vw] font-sans text-white rounded-lg py-2 px-3 ${
//                         msg.senderId === nickname
//                           ? "bg-blue-500 "
//                           : "bg-green-600"
//                       }`}
//                     >
//                       <span>{msg.content}</span>
//                     </div>
//                     {/* {msg.senderId === nickname && (
//                       <span className="ml-2 text-gray-500">: {nickname}</span>
//                     )} */}
//                   </div>
//                 ))}
//             </div>

//             <div className="absolute self-center rounded-xl bottom-8 py-3 px-4 w-[60vw] flex items-center">
//               <div className="relative w-full">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-4">
//                   <SVG.EmojiIcon />
//                 </span>
//                 <input
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       setSenderMessages((prevData: any) => {
//                         return [
//                           ...prevData,
//                           {
//                             content: senderMessage,
//                             timestamp: new Date(),
//                             senderId: nickname,
//                           },
//                         ];
//                       });
//                       sendMessage();
//                       setSenderMessage("");
//                     }
//                   }}
//                   value={senderMessage}
//                   onChange={(e) => {
//                     const inputText = e.target.value.slice(0, 1200);
//                     setSenderMessage(inputText);
//                   }}
//                   className="w-full border-[2px] font-sans px-4 py-3 rounded-xl pl-14 pr-14 focus:outline-none focus:border-blue-700 transition duration-300"
//                   type="text"
//                   placeholder="Type a message... 🚀"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                   <button
//                     onClick={() => {
//                       setSenderMessages((prevData: any) => {
//                         return [
//                           ...prevData,
//                           {
//                             content: senderMessage,
//                             timestamp: new Date(),
//                             senderId: nickname,
//                           },
//                         ];
//                       });
//                       sendMessage();

//                       setSenderMessage("");
//                     }}
//                   >
//                     <SVG.SendIcon />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="self-center text-4xl font-mono">
//             Hi {nickname}, Find people and start chatting!
//           </div>
//         )}
//       </section>
//       <Toaster />
//     </main>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Stomp from "stompjs";
import { useRouter } from "next/navigation";
import SVG from "../lib/SVGs/SVG";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";
import ChatSection from "../components/ChatSection";

interface User {
  nickName: string;
  realName: string;
  status: string;
  avatarUrl: string;
}

const baseURL = "http://localhost:8080";

export default function Chat() {
  const searchParams = useSearchParams();
  const nickname = searchParams?.get("nickname");
  const realName = searchParams?.get("realName");

  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [senderMessage, setSenderMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [senderMessages, setSenderMessages] = useState<any>([]);
  const [receiverMessages, setReceiverMessages] = useState<any>([]);
  const [allMessages, setAllMessages] = useState<any>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const chatContainerRef = useRef<any>(null);
  const router = useRouter();
  const [stompClient, setStompClient] = useState<any>(null);
  const socket = new SockJS(`${baseURL}/ws`);

  const handleLogout = () => {
    if (stompClient) {
      if (nickname && realName) {
        stompClient.send(
          "/app/user.disconnectUser",
          {},
          JSON.stringify({
            nickName: nickname,
            fullName: realName,
            status: "OFFLINE",
          })
        );
      }
      stompClient.disconnect();
      setStompClient(null);
    }
    router.push("/");
  };

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter users based on search query
  const filteredUsers = connectedUsers.filter(
    (user) =>
      user?.nickName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.realName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  // Handle chat selection on mobile
  const handleChatSelect = (user: User) => {
    setActiveIndex({ nickname: user.nickName, avatarUrl: user.avatarUrl });
    fetchAndDisplayUserChat(user.nickName);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Back button for mobile view
  const handleBack = () => {
    setShowSidebar(true);
    setActiveIndex(null);
  };

  const connectToWebSocket = () => {
    const stomp = Stomp.over(socket);

    stomp.connect(
      {},
      () => {
        console.log("WebSocket connected");
        // toast.success("Connected successfully!");
        setStompClient(stomp);

        subscribeToUserTopics(stomp);

        if (nickname && realName) {
          saveUser(nickname, realName, stomp);
        } else {
          console.error("Nickname or realName is null or undefined");
        }

        findAndDisplayConnectedUsers();
      },
      (error: any) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  useEffect(() => {
    connectToWebSocket();
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [nickname, realName]);

  useEffect(() => {
    setAllMessages([...senderMessages, ...receiverMessages]);
  }, [senderMessages, receiverMessages]);

  const subscribeToUserTopics = (stomp: any) => {
    const userId = nickname;
    const topic1 = `/user/${userId}/topic`;
    const topic2 = `/user/${userId}/queue/messages`;

    stomp.subscribe(topic1, (message: any) => {
      const user: User = JSON.parse(message.body);
      console.log("Received user object from server:", user);
    });

    stomp.subscribe(topic2, async (message: any) => {
      await findAndDisplayConnectedUsers();
      const receivedFrame = JSON.parse(message.body);
      setReceiverMessages((prevData: any) => [
        ...prevData,
        {
          content: receivedFrame.content,
          timestamp: receivedFrame.timestamp,
          senderId: receivedFrame.senderId,
          avatarUrl: receivedFrame.avatarUrl,
        },
      ]);
    });
  };

  const findAndDisplayConnectedUsers = async () => {
    const connectedUsrsResponse = await fetch(`${baseURL}/users`);
    const connectedUsrs: User[] = await connectedUsrsResponse.json();
    const filteredUsers: User[] = connectedUsrs.filter(
      (user: User) => user.nickName !== nickname
    );
    setConnectedUsers(filteredUsers);
  };

  async function fetchAndDisplayUserChat(selectedUserId: string) {
    setSenderMessages([]);
    setReceiverMessages([]);
    const userChatResponse = await fetch(
      `${baseURL}/messages/${nickname}/${selectedUserId}`
    );
    const userChat = await userChatResponse.json();
    userChat?.forEach((chat: any) => {
      if (chat.senderId === selectedUserId) {
        setReceiverMessages((prevData: any) => [
          ...prevData,
          {
            content: chat.content,
            timestamp: chat.timestamp,
            senderId: chat.senderId,
          },
        ]);
      } else {
        setSenderMessages((prevData: any) => [
          ...prevData,
          {
            content: chat.content,
            timestamp: chat.timestamp,
            senderId: chat.senderId,
          },
        ]);
      }
    });
  }

  const sendMessage = () => {
    console.log("jhshdjs");
    if (senderMessage.trim() !== "") {
      const chatMessage = {
        senderId: nickname,
        recipientId: activeIndex?.nickname,
        content: senderMessage,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    }
  };

  const saveUser = (nickname: string, realName: string, stomp: any) => {
    if (stomp) {
      setStompClient(stomp);
      if (nickname && realName) {
        stomp.send(
          "/app/user.addUser",
          {},
          JSON.stringify({
            nickName: nickname,
            fullName: realName,
            status: "ONLINE",
          })
        );
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Sidebar with online members */}

      {showSidebar && (
        <Sidebar
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          setMenuOpen={setMenuOpen}
          menuOpen={menuOpen}
          filteredUsers={filteredUsers}
          activeIndex={activeIndex?.nickname}
          handleLogout={handleLogout}
          handleChatSelect={handleChatSelect}
          isMobile={isMobile}
        />
      )}

      {/* Chat section */}

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
                    src={activeIndex?.avatarUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-900">
                    {activeIndex?.nickname}
                  </p>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
                <div className="flex gap-3">
                  {/* <button className="p-2 hover:bg-gray-100 rounded-full">
                    <SVG.SearchIcon />
                  </button> */}
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
                      msg.senderId === nickname
                        ? "justify-end"
                        : "justify-start"
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
                      if (senderMessage.trim()) {
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
                    if (senderMessage.trim()) {
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

      <Toaster />
    </main>
  );
}
