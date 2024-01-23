
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  Search,
  Sidebar,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { ChatUserInfo } from "../types/ChatUserInfo.type";

export const Main = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '');
  const [users, setUsers] = useState<Array<ChatUserInfo>>([]);
  //페이지로딩될때 클라이언트가 변하기때문에 activate가 두번된다 하지만 activate 를 한번만하도록 설정하면된다
  const client = new Client({
    brokerURL: `ws://localhost/react-chat`,
    onConnect: () => {
      client.subscribe(`/topic/enter-chat`, (data) => {
        console.log(data);
        const tmpUsers = JSON.parse(data.body);
        setUsers(tmpUsers);
        console.log(users);

      });
    },
    onDisconnect: () => {

    },
    connectHeaders: {
      Authorization: user.token,
      uiNum: user.uiNum
    }
  });

  useEffect(() => {
    client.activate();
  }, [])

  return (
    <div
      style={{
        height: "600px",
        position: "relative"
      }}
    >
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            {users.map((user, idx) => (
              <Conversation key={idx}
                name={user.uiName}
                lastSenderName={user.uiName}
                info="Yes i can do it for you"
                style={{ justifyContent: "start" }}
              >
                <Avatar
                  src={require("./images/ram.png")} //이미지는 여기 추가
                  name="Lilly"
                  status={user.login ? 'available' : 'dnd'}
                />
              </Conversation>
            ))}


            {users.map((user, idx) => (
              <Conversation key={idx}
                name={user.uiName}
                lastSenderName={user.uiName}
                info="Yes i can do it for you"
                style={{ justifyContent: "start" }}
              >
                <Avatar
                  src={require("./images/ram.png")} //이미지는 여기 추가
                  name="Lilly"
                  status={user.login ? 'available' : 'dnd'}
                />
              </Conversation>
            ))}

            <Conversation
              name="Emily"
              lastSenderName="Emily"
              info="Yes i can do it for you"
              unreadCnt={3}
            >
              <Avatar
                src={require("./images/ram.png")}
                name="Emily"
                status="available"
              />
            </Conversation>

            <Conversation
              name="Kai"
              lastSenderName="Kai"
              info="Yes i can do it for you"
              unreadDot
            >
              <Avatar
                src={require("./images/ram.png")}
                name="Kai"
                status="unavailable"
              />
            </Conversation>

            <Conversation
              name="Akane"
              lastSenderName="Akane"
              info="Yes i can do it for you"
            >
              <Avatar
                src={require("./images/ram.png")}
                name="Akane"
                status="eager"
              />
            </Conversation>

            <Conversation
              name="Eliot"
              lastSenderName="Eliot"
              info="Yes i can do it for you"
            >
              <Avatar
                src={require("./images/ram.png")}
                name="Eliot"
                status="away"
              />
            </Conversation>

            <Conversation
              name="Zoe"
              lastSenderName="Zoe"
              info="Yes i can do it for you"
              active
            >
              <Avatar
                src={require("./images/ram.png")}
                name="Zoe"
                status="dnd"
              />
            </Conversation>

            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={require("./images/ram.png")}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={require("./images/ram.png")} name="Zoe" />
            <ConversationHeader.Content
              userName="Zoe"
              info="Active 10 mins ago"
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            <MessageSeparator content="Saturday, 30 November 2019" />

            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "single"
              }}
            >
              <Avatar src={require("./images/ram.png")} name="Zoe" />
            </Message>

            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Patrik",
                direction: "outgoing",
                position: "single"
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "first"
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "normal"
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "normal"
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "last"
              }}
            >
              <Avatar src={require("./images/ram.png")} name="Zoe" />
            </Message>

            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Patrik",
                direction: "outgoing",
                position: "first"
              }}
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Patrik",
                direction: "outgoing",
                position: "normal"
              }}
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Patrik",
                direction: "outgoing",
                position: "normal"
              }}
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Patrik",
                direction: "outgoing",
                position: "last"
              }}
            />

            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "first"
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "last"
              }}
            >
              <Avatar src={require("./images/ram.png")} name="Zoe" />
            </Message>
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={() => setMessageInputValue("")}
          />
        </ChatContainer>

        {/* <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="LOCALIZATION">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="MEDIA">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="SURVEY">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="OPTIONS">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
        </Sidebar> */}
      </MainContainer>
    </div>
  );
}
