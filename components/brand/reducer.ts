export type Message = {
  id: number
  content: string
  sender: 'user' | 'bot'
  senderName: string
  timestamp: string
  status: 'sent' | 'delivered' | 'seen'
}

export type ChatState = {
  messages: Message[]
  newMessage: string
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id'> }
  | { type: 'UPDATE_NEW_MESSAGE'; payload: string }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { id: number; status: Message['status'] } }
  | { type: 'SET_INITIAL_MESSAGES'; payload: Message[] }
  
export const initialState: ChatState = {
    messages: [],
    newMessage: ''
  }
  
export  function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
      case 'ADD_MESSAGE':
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              ...action.payload,
              id: state.messages.length + 1
            }
          ],
          newMessage: ''
        }
      case 'UPDATE_NEW_MESSAGE':
        return {
          ...state,
          newMessage: action.payload
        }
      case 'UPDATE_MESSAGE_STATUS':
        return {
          ...state,
          messages: state.messages.map(message =>
            message.id === action.payload.id
              ? { ...message, status: action.payload.status }
              : message
          )
        }
      case 'SET_INITIAL_MESSAGES':
        return {
          ...state,
          messages: action.payload
        }
      default: {
        action satisfies never
        return state
      }
    }
  }