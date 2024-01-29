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
import { useEffect, useRef, useState } from "react";
import { Msg } from "../types/Msg.type";
import { User } from "../types/User.type";

export const Main = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '');
  const [users, setUsers] = useState<User[]>([]);
  //상대방이 보낸메세지
  let [msgs, setMsgs] = useState<Msg[]>([]);
  const [diffrentUser, setdifUser] = useState<User>();
  const client = useRef<any>({});
  const [typing, setTyping] = useState<boolean>(false);
  //client.activate()를 useEffect에서 사용하면 Client의 상태변화에 대응하지 못하는 송수신이 일어나므로 따로 함수로 만들고 client.current에 저장한다
  const init = () => {
    client.current = new Client({
      brokerURL: `${process.env.REACT_APP_WS_PROTOCAL}://${process.env.REACT_APP_HOST}/react-chat`,
      onConnect: () => {
        //data는 smt.convertAndSend로 응답한 res 느낌..?
        client.current.subscribe(`/topic/enter-chat`, (data: any) => {
          const tmpUsers = JSON.parse(data.body);
          setUsers(tmpUsers);
        });

        client.current.subscribe(`/topic/chat/${user.uiNum}`, (data: any) => {
          const msg = JSON.parse(data.body);
          setMsgs(msgs => [...msgs, msg]);

        });

        client.current.subscribe(`/topic/chat-length/${user.uiNum}`, (data: any) => {
          const message = JSON.parse(data.body);
          console.log(message.cmiMessage);
          console.log(data.body);
          setTyping(message.cmiMessage.length > 0);
        });

        client.current.subscribe(`/topic/message-log/${user.uiNum}`, (data: any) => {
          const msg = JSON.parse(data.body);
          setMsgs(msg);
          console.log(msg);
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

  const MessageLog = (ReceiveUiNum:any) => {
    client.current.publish({
      destination: `/publish/message-log/${user.uiNum}`,
      body: JSON.stringify({
        cmiSenderUiNum: user.uiNum,
        cmiMessage: messageInputValue,
        cmiReceiveUiNum: ReceiveUiNum
      })
    });


    setMsgs(msgs);

  }


  //메세지를 입력중일때 /publish 경로를 타고들어간 ReactChat 컨트롤러로 가서 메세지 vo를 반환
  const CheckMessageLength = (value:any) => {
    client.current.publish({
      destination: `/publish/chat-length/${user.uiNum}`,
      body: JSON.stringify({
        cmiSenderUiNum: user.uiNum,
        cmiMessage: value,
        cmiReceiveUiNum: diffrentUser?.uiNum
      })
    });


  }
  useEffect(() => {
    setMsgs(msgs);
  }, [msgs]);
  //useEffect의 매개변수가 [] 인경우 한번만 하게됨
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
                onClick={async function () {
                  //선택한 사용자를 useState사용해서 저장하고 활용
                  setdifUser(user);
                  //선택한 사용자에 대한 메세지 객체를 반환
                  MessageLog(user.uiNum);
                  //메세지내역을 보여줌
                  setMsgs(msgs);
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
              userName={diffrentUser ? diffrentUser.uiName : user.uiName}
              info={diffrentUser ? diffrentUser.loginDate : user.loginDate} //집가서하기..
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
              CheckMessageLength(val);
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