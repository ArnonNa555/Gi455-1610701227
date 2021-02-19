using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;
using UnityEngine.UI;


public class WebsocketConnection : MonoBehaviour
{
    public class MessData
    {
        public string username;
        public string message;
    }

    private WebSocket websocket;
    

    public InputField inputname;
    public InputField inputtext;
    public Text Error;
    public Text SendT;
    public Text reText;
    public Text NName;

    
    public GameObject CRoom;
    public GameObject JRoom;
    public GameObject Leave;
    public GameObject Chat;
    public GameObject BuildRoom; 

    private string sendMess;
    private string reMess;

    private string tempMessST;

    public struct SocketEvent
    {
        public string eventName;
        public string data;

        public SocketEvent(string eventName, string data)
        {
            this.eventName = eventName;
            this.data = data;
        }
    }
    public delegate void DelegateHandle(SocketEvent result);
    public DelegateHandle OnCreateRoom;
    public DelegateHandle OnJoinRoom;
    public DelegateHandle OnLeaveRoom;

    // Start is called before the first frame update
    void Start()
    {
        
        
        //websocket  = new WebSocket("ws://127.0.0.1:25500/");

        //websocket.OnMessage += Onmessage;

        //websocket.Connect();

    }

    // Update is called once per frame
    void Update()
    {

        UpdateNotifyMessage();

        if(string.IsNullOrEmpty(tempMessST) == false)
        {
            MessData reciveMessData = JsonUtility.FromJson<MessData>(tempMessST);

            if(reciveMessData.username == inputname.text)
            {
                SendT.text += reciveMessData.username +": "+ reciveMessData.message + "\n";
            }
            else
            {
                reText.text += reciveMessData.username + ": "+ reciveMessData.message + "\n";
            }

            
            tempMessST = "";
        }
        
    }

    public void OnDestroy()
    {
        if (websocket != null)
        {
            websocket.Close();
        }
    }

    ///public void send()
   // {
       // Chat = FieldChat.GetComponent<Text>().text;
       // Tex.GetComponent<Text>().text += Chat + "\n";
       // Tex.GetComponent<Text>().alignment = TextAnchor.LowerRight;
      //  inputField.text = null;
       // websocket.Send(Chat);
    //}

    //public void SendMess()
   // {
       // if (inputtext.text == "" || websocket.ReadyState != WebSocketState.Open)
           // return;

        //MessData messData = new MessData();
       // messData.username = inputname.text;
       // messData.message = inputtext.text;

        //string toJson = JsonUtility.ToJson(messData);

        //websocket.Send(toJson);
        //inputtext.text = "";
    //}

    public void OnMessage(object sender, MessageEventArgs messageEventArgs)
    {
        Debug.Log("Message from server : " + messageEventArgs.Data);
        tempMessST = messageEventArgs.Data;

    }

    public void Login()
    {
        websocket = new WebSocket("ws://127.0.0.1:25500/");

        websocket.OnMessage += OnMessage;

        websocket.Connect();
        //websocket.Send("Conected");
    }


    public void CreateRoom(InputField RoomName)
    {
        SocketEvent socketEvent = new SocketEvent("CreateRoom", RoomName.text);

        string toJsonStr = JsonUtility.ToJson(socketEvent);

        websocket.Send(toJsonStr);

        NName.text = RoomName.text;
    }
    public void JoinRoom(InputField RoomName)
    {
        SocketEvent socketEvent = new SocketEvent("JoinRoom", RoomName.text);

        string toJsonStr = JsonUtility.ToJson(socketEvent);

        websocket.Send(toJsonStr);

        NName.text = RoomName.text;
    }
    public void LeaveRoom()
    {
        SocketEvent socketEvent = new SocketEvent("LeaveRoom", "");

        string toJsonStr = JsonUtility.ToJson(socketEvent);

        websocket.Send(toJsonStr);
    }

    private void UpdateNotifyMessage()
    {
        if (string.IsNullOrEmpty(tempMessST) == false)
        {
            SocketEvent receiveMessageData = JsonUtility.FromJson<SocketEvent>(tempMessST);

            if (receiveMessageData.eventName == "CreateRoom")
            {
                if (OnCreateRoom != null)
                    OnCreateRoom(receiveMessageData);
                if (receiveMessageData.data != "fail")
                {
                    ChatRoom();
                }
                else
                {
                    Error.text = "Not Build";
                }
            }
            else if (receiveMessageData.eventName == "JoinRoom")
            {
                if (OnJoinRoom != null)
                    OnJoinRoom(receiveMessageData);
                if (receiveMessageData.data != "fail")
                {
                    ChatRoom();
                }
                else
                {
                    Error.text = "Not Join";
                }
            }
            else if (receiveMessageData.eventName == "LeaveRoom")
            {
                if (OnLeaveRoom != null)
                    OnLeaveRoom(receiveMessageData);
            }

            tempMessST = "";
        }

    }

    public void ChatRoom()
    {
        BuildRoom.SetActive(false);
        Chat.SetActive(true);
    }























}
