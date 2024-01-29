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
  //상대방이 보낸메세지
  const [msgs, setMsgs] = useState<Msg[]>([]);
  //상대방이 보내고 있는중일때 메세지 길이를판단하기위한 메세지
  const [message, setMessage] = useState<Msg>();
  const [diffrentUser, setdifUser] = useState<User>();
  const client = useRef<any>({});
  const [typing, setTyping] = useState<boolean>(false);
  //client.activate()를 useEffect에서 사용하면 Client의 상태변화에 대응하지 못하는 송수신이 일어나므로 따로 함수로 만들고 client.current에 저장한다
  const init = () => {
    client.current = new Client({
      brokerURL: `${process.env.REACT_APP_WS_PROTOCAL}://${process.env.REACT_APP_HOST}/react-chat`,
      onConnect: () => {
        client.current.subscribe(`/topic/enter-chat`, (data: any) => {
          const tmpUsers = JSON.parse(data.body);
          setUsers(tmpUsers);
        });

        client.current.subscribe(`/topic/chat/${user.uiNum}`, (data: any) => {
          const msg = JSON.parse(data.body);
          setMsgs(msgs => [...msgs, msg]);

        });

        client.current.subscribe(`/topic/user-info/${user.uiNum}`, (data: any) => {
          const userInfo = JSON.parse(data.body);
          setdifUser(userInfo);
          console.log(userInfo);
        });

        client.current.subscribe(`/topic/chat-length/${user.uiNum}`, (data: any) => {
          const message = JSON.parse(data.body);
          setMessage(message);
          if(diffrentUser?.uiNum === message?.cmiSenderUiNum){
            if(message?.cmiMessage?.length){
              setTyping(message?.cmiMessage?.length > 0);  
            }
          }
        });

      },
      onDisconnect: () => {

      },
      connectHeaders: {
        Authorization: `${user.token}`,
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
        cmiMessage: messageInputValue,
        cmiReceiveUiNum: diffrentUser?.uiNum
      })
    });
    setMessageInputValue('');

  }

  //메세지를 입력중일때 /publish 경로를 타고들어간 ReactChat 컨트롤러로 가서 메세지 vo를 반환
  const CheckMessageLength = () => {
    client.current.publish({
      destination: `/publish/chat-length/${user.uiNum}`,
      body: JSON.stringify({
        cmiSenderUiNum: user.uiNum,
        cmiMessage: messageInputValue,
        cmiReceiveUiNum: diffrentUser?.uiNum
      })
    });


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
                //클릭시 set함수로 useState 변수변경 시도하기 
                onClick={function () {
                  let uiNum: any = JSON.parse(localStorage.getItem('user') || '').uiNum;
                  console.log(user.uiNum);
                  client.current.publish({
                    destination: `/publish/user-info/${user.uiNum}`,
                    body: JSON.stringify({
                      cmiSenderUiNum: uiNum
                    })
                  });
                  setMsgs([]);
                }}
              >
                <Avatar
                  src={"https://secu-team5-bucket.s3.ap-northeast-2.amazonaws.com/27bafffa-3d26-4e74-a7d5-9bb7e1205c13.png"}
                  name="Lilly"
                  status={user.login ? 'available' : 'dnd'}
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={"https://secu-team5-bucket.s3.ap-northeast-2.amazonaws.com/27bafffa-3d26-4e74-a7d5-9bb7e1205c13.png"} name={diffrentUser ? diffrentUser.uiName : ''} />
            <ConversationHeader.Content
              userName={diffrentUser ? diffrentUser.uiName : 'undefind'}
              info="Active 10 mins ago" //집가서하기..
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={typing ? <TypingIndicator content={diffrentUser ? diffrentUser.uiName + " 님이 입력중입니다." : ''} /> : ''}
          >
            <MessageSeparator content="Saturday, 30 November 2019" />
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




          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val) => {
              setMessageInputValue(val);
              CheckMessageLength();
              if(diffrentUser?.uiNum === message?.cmiSenderUiNum){
                if(message?.cmiMessage?.length){
                  setTyping(message?.cmiMessage?.length > 0);  
                }
              }
              console.log(message);
            }}
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