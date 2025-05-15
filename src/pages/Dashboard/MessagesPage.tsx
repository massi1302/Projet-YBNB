import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Clock, User } from 'lucide-react';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

// Mock messages data
const mockMessages = [
  {
    id: 'm1',
    senderId: 'user1',
    receiverId: 'host1',
    content: 'Hi, is this property still available for the dates I selected?',
    createdAt: '2024-03-24T10:30:00Z',
    read: true,
  },
  {
    id: 'm2',
    senderId: 'host1',
    receiverId: 'user1',
    content: 'Yes, it is! Would you like to proceed with the booking?',
    createdAt: '2024-03-24T10:35:00Z',
    read: false,
  },
  {
    id: 'm3',
    senderId: 'user1',
    receiverId: 'host2',
    content: 'What\'s the check-in process like?',
    createdAt: '2024-03-23T15:20:00Z',
    read: true,
  },
  {
    id: 'm4',
    senderId: 'host2',
    receiverId: 'user1',
    content: 'We have a digital lock system. I\'ll send you the code on the day of check-in.',
    createdAt: '2024-03-23T15:25:00Z',
    read: true,
  },
];

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  userImage?: string;
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="mb-8">You need to be logged in to view your messages.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  // Get user's conversations
  const conversations: Conversation[] = Array.from(
    new Set(
      mockMessages
        .filter(m => m.senderId === user.id || m.receiverId === user.id)
        .map(m => m.senderId === user.id ? m.receiverId : m.senderId)
    )
  ).map(userId => {
    const conversationMessages = mockMessages
      .filter(m => 
        (m.senderId === user.id && m.receiverId === userId) ||
        (m.senderId === userId && m.receiverId === user.id)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = conversationMessages.filter(m => 
      m.receiverId === user.id && !m.read
    ).length;

    return {
      userId,
      userName: userId.includes('host') ? `Host ${userId.slice(-1)}` : `User ${userId.slice(-1)}`,
      userImage: `https://i.pravatar.cc/150?u=${userId}`,
      lastMessage: conversationMessages[0],
      unreadCount,
    };
  });

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get messages for selected conversation
  const conversationMessages = selectedConversation
    ? mockMessages
        .filter(m => 
          (m.senderId === user.id && m.receiverId === selectedConversation) ||
          (m.senderId === selectedConversation && m.receiverId === user.id)
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In a real app, this would send the message to the backend
    const message: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      receiverId: selectedConversation,
      content: newMessage,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Add message to mock data
    mockMessages.push(message);
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Messages</h1>

          <Card className="overflow-hidden">
            <div className="flex h-[600px]">
              {/* Conversations list */}
              <div className="w-full sm:w-80 border-r">
                <div className="p-4 border-b">
                  <Input
                    placeholder="Search conversations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search size={16} />}
                    fullWidth
                  />
                </div>

                <div className="overflow-y-auto h-[calc(600px-73px)]">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No conversations found
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.userId}
                        onClick={() => setSelectedConversation(conv.userId)}
                        className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                          selectedConversation === conv.userId ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          {conv.userImage ? (
                            <img
                              src={conv.userImage}
                              alt={conv.userName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5A5F] text-white text-xs flex items-center justify-center rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <p className="font-medium truncate">{conv.userName}</p>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage.senderId === user.id ? 'You: ' : ''}
                            {conv.lastMessage.content}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Messages view */}
              <div className="hidden sm:flex flex-col flex-grow">
                {selectedConversation ? (
                  <>
                    {/* Conversation header */}
                    <div className="p-4 border-b flex items-center space-x-3">
                      {filteredConversations.find(c => c.userId === selectedConversation)?.userImage ? (
                        <img
                          src={filteredConversations.find(c => c.userId === selectedConversation)?.userImage}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {filteredConversations.find(c => c.userId === selectedConversation)?.userName}
                        </p>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                      {conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.senderId === user.id
                                ? 'bg-[#FF5A5F] text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className={`text-xs mt-1 flex items-center ${
                              message.senderId === user.id ? 'text-white/80' : 'text-gray-500'
                            }`}>
                              {formatTime(message.createdAt)}
                              {message.senderId === user.id && (
                                <>
                                  <span className="mx-1">•</span>
                                  {message.read ? (
                                    <span>Read</span>
                                  ) : (
                                    <Clock size={12} />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message input */}
                    <div className="p-4 border-t">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                        className="flex space-x-2"
                      >
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          fullWidth
                        />
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={!newMessage.trim()}
                          icon={<Send size={16} />}
                        >
                          Send
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}