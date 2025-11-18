import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const MessagesPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    conversations,
    messages,
    selectedOrderId,
    isLoading,
    isSending,
    fetchConversations,
    fetchMessages,
    sendMessage,
    clearSelectedConversation,
  } = useMessageStore();

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadConversations(true);

    // Smart polling: only poll if not typing and not sending
    const interval = setInterval(() => {
      // Only poll if user is not actively typing and not sending
      if (!isTyping && !isSending) {
        loadConversations(false); // Poll without loading indicator
        if (selectedOrderId) {
          fetchMessages(selectedOrderId, false); // Poll without loading indicator
        }
      }
    }, 5000); // Increased to 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderId]);

  useEffect(() => {
    // Only auto-scroll if user hasn't scrolled up
    if (!userScrolledUp) {
      // Use instant scroll without animation to prevent jump
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [messages, userScrolledUp]);

  // Detect user scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

      setUserScrolledUp(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const loadConversations = async (showLoading = true) => {
    await fetchConversations(showLoading);
  };

  const handleSelectConversation = async (orderId) => {
    await fetchMessages(orderId);
  };

  const handleMessageChange = (e) => {
    setMessageText(e.target.value);

    // Set typing state
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to clear typing state
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000); // 2 seconds after user stops typing
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      toast.error("Pesan tidak boleh kosong");
      return;
    }

    if (!selectedOrderId) {
      toast.error("Pilih percakapan terlebih dahulu");
      return;
    }

    // Lock scroll position at bottom before sending
    const container = messagesContainerRef.current;
    const wasAtBottom = container && container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    try {
      await sendMessage(selectedOrderId, { message: messageText });
      setMessageText("");
      setIsTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      // If was at bottom, stay at bottom
      if (wasAtBottom) {
        setUserScrolledUp(false);
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 0);
      }
    } catch {
      // Error handled in store
    }
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    } else {
      return messageDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const selectedConversation = conversations.find((conv) => conv.order._id === selectedOrderId);

  return (
    <DashboardLayout>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-green-50">
        {/* Premium Header */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            style={{ height: "calc(100vh - 120px)", minHeight: "650px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className={`border-r border-gray-200 flex flex-col ${selectedOrderId && "hidden md:block"}`}>
                <div className="p-6 border-b-2 border-green-100 bg-linear-to-r from-green-50 to-emerald-50 shrink-0">
                  <h2 className="text-xl font-bold text-gray-900">Obrolan</h2>
                  <p className="text-sm text-green-600 mt-1 font-medium">{conversations.length} Pesan Aktif</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {isLoading && !selectedOrderId ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 text-center py-12">
                      <div className="p-6 bg-green-100 rounded-3xl mb-4">
                        <MessageSquare className="h-16 w-16 text-green-600" />
                      </div>
                      <p className="text-gray-900 font-bold text-lg mb-2">Belum ada percakapan</p>
                      <p className="text-sm text-gray-500">Pesan akan muncul saat Anda memiliki pesanan aktif</p>
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const otherUser =
                        authUser._id === conv.order.clientId._id ? conv.order.freelancerId : conv.order.clientId;
                      const isSelected = selectedOrderId === conv.order._id;

                      return (
                        <button
                          key={conv.order._id}
                          onClick={() => handleSelectConversation(conv.order._id)}
                          className={`w-full p-5 border-b border-gray-100 hover:bg-linear-to-r hover:from-green-50 hover:to-emerald-50 transition-all text-left transform hover:translate-x-1 ${
                            isSelected
                              ? "bg-linear-to-r from-green-100 to-emerald-100 border-l-4 border-l-green-600 shadow-lg"
                              : ""
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-200 shrink-0 shadow-lg">
                                {otherUser?.profileImage ? (
                                  <>
                                    <img
                                      src={`${otherUser.profileImage}?t=${Date.now()}`}
                                      alt={otherUser.fullName}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        console.log("Profile image load error:", otherUser.profileImage);
                                        e.target.style.display = "none";
                                        const fallback = e.target.parentElement.querySelector(".fallback-icon");
                                        if (fallback) fallback.style.display = "flex";
                                      }}
                                    />
                                    <div className="fallback-icon hidden h-full w-full items-center justify-center">
                                      <img
                                        src="/images/avatar.png"
                                        alt={otherUser.fullName}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <img
                                    src="/images/avatar.png"
                                    alt={otherUser.fullName}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/user/${otherUser._id}`);
                                  }}
                                  className="font-bold text-gray-900 truncate hover:text-purple-600 transition-colors text-base cursor-pointer"
                                >
                                  {otherUser.fullName}
                                </div>
                                {conv.unreadCount > 0 && (
                                  <span className="ml-2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 truncate mb-1 font-medium">
                                {conv.order.serviceId.title}
                              </p>

                              {conv.lastMessage && (
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-500 truncate">
                                    {conv.lastMessage.senderId._id === authUser._id ? "✓ Anda: " : ""}
                                    {conv.lastMessage.message}
                                  </p>
                                  <span className="text-xs text-green-400 ml-2 shrink-0 font-medium">
                                    {formatDate(conv.lastMessage.createdAt)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div
                className={`col-span-2 flex flex-col h-full overflow-hidden ${!selectedOrderId && "hidden md:flex"}`}
              >
                {selectedOrderId && selectedConversation ? (
                  <>
                    {/* Chat Header - Fixed Height */}
                    <div className="p-6 border-b-2 border-green-100 bg-linear-to-r from-green-50 to-emerald-50 shrink-0">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={clearSelectedConversation}
                          className="md:hidden p-2 hover:bg-white rounded-xl transition-all shadow-md"
                        >
                          <ArrowLeft className="h-5 w-5 text-green-600" />
                        </button>

                        <div className="relative">
                          <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
                            {(authUser._id === selectedConversation.order.clientId._id
                              ? selectedConversation.order.freelancerId
                              : selectedConversation.order.clientId
                            )?.profileImage ? (
                              <>
                                <img
                                  src={`${
                                    (authUser._id === selectedConversation.order.clientId._id
                                      ? selectedConversation.order.freelancerId
                                      : selectedConversation.order.clientId
                                    ).profileImage
                                  }?t=${Date.now()}`}
                                  alt={
                                    (authUser._id === selectedConversation.order.clientId._id
                                      ? selectedConversation.order.freelancerId
                                      : selectedConversation.order.clientId
                                    ).fullName
                                  }
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    console.log("Profile image load error");
                                    e.target.style.display = "none";
                                    const fallback = e.target.parentElement.querySelector(".fallback-icon");
                                    if (fallback) fallback.style.display = "flex";
                                  }}
                                />
                                <div className="fallback-icon hidden h-full w-full items-center justify-center">
                                  <img
                                    src="/images/avatar.png"
                                    alt={
                                      (authUser._id === selectedConversation.order.clientId._id
                                        ? selectedConversation.order.freelancerId
                                        : selectedConversation.order.clientId
                                      ).fullName
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </>
                            ) : (
                              <img
                                src="/images/avatar.png"
                                alt={
                                  (authUser._id === selectedConversation.order.clientId._id
                                    ? selectedConversation.order.freelancerId
                                    : selectedConversation.order.clientId
                                  ).fullName
                                }
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>

                        <div className="flex-1">
                          <button
                            onClick={() => {
                              const otherUser =
                                authUser._id === selectedConversation.order.clientId._id
                                  ? selectedConversation.order.freelancerId
                                  : selectedConversation.order.clientId;
                              navigate(`/user/${otherUser._id}`);
                            }}
                            className="font-bold text-gray-900 hover:text-green-600 transition-colors text-lg"
                          >
                            {
                              (authUser._id === selectedConversation.order.clientId._id
                                ? selectedConversation.order.freelancerId
                                : selectedConversation.order.clientId
                              ).fullName
                            }
                          </button>
                          <p className="text-sm text-green-600 font-medium">
                            {selectedConversation.order.serviceId.title}
                          </p>
                        </div>

                        <span
                          className={`px-4 py-2 text-sm font-bold rounded-xl shadow-lg ${
                            selectedConversation.order.status === "pending"
                              ? "bg-linear-to-r from-yellow-100 to-yellow-200 text-yellow-700"
                              : selectedConversation.order.status === "in-progress"
                              ? "bg-linear-to-r from-blue-100 to-blue-200 text-blue-700"
                              : selectedConversation.order.status === "completed"
                              ? "bg-linear-to-r from-green-100 to-green-200 text-green-700"
                              : "bg-linear-to-r from-red-100 to-red-200 text-red-700"
                          }`}
                        >
                          {selectedConversation.order.status === "pending"
                            ? "Menunggu"
                            : selectedConversation.order.status === "in-progress"
                            ? "Dalam Proses"
                            : selectedConversation.order.status === "completed"
                            ? "Selesai"
                            : "Dibatalkan"}
                        </span>
                      </div>
                    </div>

                    {/* Messages - Scrollable Area */}
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 overflow-y-auto p-6 space-y-4 bg-linear-to-br from-gray-50 to-green-50 min-h-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <LoadingSpinner />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                          <div className="p-6 bg-green-100 rounded-3xl mb-4">
                            <MessageSquare className="h-16 w-16 text-green-600" />
                          </div>
                          <p className="text-gray-900 font-bold text-lg">Belum ada pesan</p>
                          <p className="text-sm text-gray-500 mt-1">Mulai percakapan dengan mengirim pesan</p>
                        </div>
                      ) : (
                        <>
                          {messages.map((msg) => {
                            const isSent = msg.senderId._id === authUser._id;

                            return (
                              <div
                                key={msg._id}
                                className={`flex ${isSent ? "justify-end" : "justify-start"} animate-in`}
                              >
                                <div className={`max-w-xs lg:max-w-md ${isSent ? "order-2" : "order-1"}`}>
                                  <div
                                    className={`px-5 py-3 rounded-2xl shadow-lg transform transition-all hover:scale-105 ${
                                      isSent
                                        ? "bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-br-none"
                                        : "bg-white text-gray-900 rounded-bl-none border-2 border-green-100"
                                    }`}
                                  >
                                    <p className="text-sm whitespace-pre-wrap overflow-wrap-break-word font-medium">
                                      {msg.message}
                                    </p>
                                  </div>
                                  <p
                                    className={`text-xs text-gray-500 mt-2 font-medium ${
                                      isSent ? "text-right" : "text-left"
                                    }`}
                                  >
                                    {formatDate(msg.createdAt)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Message Input - Fixed Height */}
                    <div className="border-t-2 border-green-100 bg-linear-to-r from-green-50 to-emerald-50 shrink-0">
                      <form onSubmit={handleSendMessage} className="p-6">
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={messageText}
                            onChange={handleMessageChange}
                            placeholder="💬 Tulis pesan..."
                            className="flex-1 px-5 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 text-gray-700 placeholder-gray-400 bg-white shadow-inner transition-all"
                            disabled={isSending}
                          />
                          <button
                            type="submit"
                            disabled={isSending || !messageText.trim()}
                            className="px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50 hover:shadow-green-500/70 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none flex items-center space-x-2 font-bold"
                          >
                            <Send className="h-5 w-5" />
                            <span className="hidden sm:inline">{isSending ? "Kirim..." : "Kirim"}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 bg-linear-to-br from-gray-50 to-green-50">
                    <div className="p-8 bg-white rounded-3xl shadow-2xl border-2 border-green-100">
                      <MessageSquare className="h-20 w-20 text-green-600 mb-4 mx-auto" />
                      <p className="text-2xl font-bold text-gray-900 mb-2">💬 Selamat Datang di Pesan</p>
                      <p className="text-gray-600 text-lg">Pilih percakapan untuk mulai chat</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
