
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MainContainer,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  VoiceCallButton,
  Message,
  MessageInput,
  VideoCallButton,
  InfoButton,
  MessageSeparator,
  TypingIndicator,
  MessageList
} from "@chatscope/chat-ui-kit-react";
import { Client } from "@stomp/stompjs";
import { User } from "../types/User.type";
import { Msg } from "../types/Msg.type";

export const Main = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '');
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const client = useRef<any>({});
  //activate를 useEffect에서 사용하면 Client의 상태변화에 대응하지 못하는 송수신이 일어나므로 따로 함수로 만들고 client.current에 저장한다
  const init = () =>{
    client.current = new Client({
      brokerURL: 'ws://localhost/react-chat',
      onConnect: () => {
        client.current.subscribe(`/topic/enter-chat`, (data:any) => {
          const tmpUsers = JSON.parse(data.body);
          setUsers(tmpUsers);
        });
  
        client.current.subscribe(`/topic/chat/${user.uiNum}`, (data:any) => {
          const msg = JSON.parse(data.body);
          setMsgs(msgs => [...msgs, msg]);
          console.log(msgs);
        });
      },
      onDisconnect: () => {
  
      },
      connectHeaders: {
        Authorization: `Bearer ${user.token}`,
        uiNum: user.uiNum
      }
    });
    client.current.activate();
  }
  //메세지 보낼때 /publish 경로를 타고들어간 ReactChat 컨트롤러로 간다
  const publishMsg = () => {
    client.current.publish({
      destination: `/publish/react-chat/${user.uiNum}`,
      body: JSON.stringify({
        cmiSenderUiNum: user.uiNum,
        cmiMessage: messageInputValue
      })
    });
    setMessageInputValue('');
  }
  //useEffect는 브라우저 로딩될때 한번만하게된다
  useEffect(() => {
    init();
  }, []);
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
                  src={"https://secu-team5-bucket.s3.ap-northeast-2.amazonaws.com/27bafffa-3d26-4e74-a7d5-9bb7e1205c13.png"}
                  name="Lilly"
                  status={user.login ? 'available' : 'dnd'} />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={"https://secu-team5-bucket.s3.ap-northeast-2.amazonaws.com/27bafffa-3d26-4e74-a7d5-9bb7e1205c13.png"} name="Zoe" />
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
            {
              msgs.map((msg) => (
                <Message
                  model={{
                    message: msg.cmiMessage,
                    sentTime: msg.cmiSentTime,
                    sender: msg.cmiSender,
                    direction: user.uiNum === msg.cmiSenderUiNum ? "outgoing" : "incoming",
                    position: "normal"
                  }}
                  avatarSpacer={user.uiNum === msg.cmiSenderUiNum}
                >
                  {user.uiNum === msg.cmiSenderUiNum ? '' : <Avatar src={"https://secu-team5-bucket.s3.ap-northeast-2.amazonaws.com/27bafffa-3d26-4e74-a7d5-9bb7e1205c13.png"} name="Zoe" />}
                </Message>
              ))
            }

            <MessageSeparator content="Saturday, 30 November 2019" />


          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={publishMsg}
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