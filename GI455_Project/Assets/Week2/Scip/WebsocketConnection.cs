using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;
using UnityEngine.UI;


public class WebsocketConnection : MonoBehaviour
{
    private WebSocket websocket;
    public string Ip;
    public string Number;
    public string Chat;
    public string Texi;
    public GameObject Texin;
    public GameObject FieldIp;
    public GameObject FieldNumber;
    public GameObject FieldChat;
    public GameObject Tex;
    public InputField inputField;
    public Transform Btext;
    
   

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
        if (Input.GetKeyDown(KeyCode.Return))
        {
            websocket.Send("Number : " + Random.Range(0, 99999));
        }


    }

    public void OnDestroy()
    {
        if (websocket != null)
        {
            websocket.Close();
        }
    }

    public void send()
    {
        Chat = FieldChat.GetComponent<Text>().text;
        Tex.GetComponent<Text>().text += Chat + "\n";
        Tex.GetComponent<Text>().alignment = TextAnchor.LowerRight;
        inputField.text = null;
        websocket.Send(Chat);
    }

    public void SendMess()
    {
        Tex.GetComponent<Text>().text += Texi + "\n";
        Tex.GetComponent<Text>().alignment = TextAnchor.LowerLeft;
        //var TexNa = Instantiate(Tex, Btext.position, Quaternion.identity);
        //TexNa.transform.parent = Btext;
    }

    public void Onmessage(object sender, MessageEventArgs eventArgs)
    {
        Debug.Log("Message from server : " + eventArgs.Data);

        Texi = eventArgs.Data;

        SendMess();

    }

    public void Login()
    {
        websocket = new WebSocket("ws://127.0.0.1:25500/");

        websocket.OnMessage += Onmessage;

        websocket.Connect();

        //websocket.Send("Conected");
    }



    

    

   












}
