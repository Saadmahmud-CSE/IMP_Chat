"use-client"

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/store";
import ChatContainer from "./chat-container";

export function chatProvider(){
    return (
        <QueryClientProvider client={queryClient}>
            <ChatContainer/>
        </QueryClientProvider>
    )
}