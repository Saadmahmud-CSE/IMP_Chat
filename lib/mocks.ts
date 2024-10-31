import { Message } from "@/components/brand/reducer";
import mockedChatMessages from "@/data/mock-data/initial-chat-messages.json" with { type: "json" };
import { sleep } from "./utils";

interface MockedChatData {
  messages: Message[];
}

const data = mockedChatMessages as MockedChatData;

export const chatMsg = data.messages;

export async function getMockChatMsg() {
  await sleep(2000);
  return chatMsg;
}
