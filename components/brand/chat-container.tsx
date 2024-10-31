"use client"

import { SendHorizontal, Check, CheckCheck, Loader2Icon } from "lucide-react"
import { useReducer } from 'react'
import { useQuery } from "react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format, isToday, isYesterday } from 'date-fns'
import { chatReducer, initialState, Message } from "./reducer"
import { getMockChatMsg } from "@/lib/mocks"

export default function ChatContainer() {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { isLoading } = useQuery({
    queryKey: ["chatMsg"],
    queryFn: getMockChatMsg,
    onSuccess: (data) => {
      dispatch({ type: "SET_INITIAL_MESSAGES", payload: data})
    },
    onError: (error) => {
      console.log(error);
    }
  }) 
  const handleSendMessage = () => {
    if (state.newMessage.trim()) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          content: state.newMessage,
          sender: 'user',
          senderName: 'You',
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
      })
    }
  }

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) {
      return format(date, "'Today at' h:mm a")
    } else if (isYesterday(date)) {
      return format(date, "'Yesterday at' h:mm a")
    } else {
      return format(date, "MMM d 'at' h:mm a")
    }
  }

  const renderMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'seen':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  if(isLoading){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen bg-background">
      <ScrollArea className="flex-grow p-4">
        {state.messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col mb-4 ${
              message.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-end space-x-2">
              {message.sender === 'bot' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Bot" />
                  <AvatarFallback>Bot</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="font-semibold text-sm mb-1">{message.senderName}</p>
                <p>{message.content}</p>
              </div>
              {message.sender === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className={`text-xs text-muted-foreground mt-1 flex items-center space-x-1 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              <span>{formatMessageDate(new Date(message.timestamp))}</span>
              {message.sender === 'user' && renderMessageStatus(message.status)}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={state.newMessage}
            onChange={(e) => dispatch({
              type: 'UPDATE_NEW_MESSAGE',
              payload: e.target.value
            })}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}