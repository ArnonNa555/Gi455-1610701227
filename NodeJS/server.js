var websocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

var ws = new websocket.Server({port:25500}, ()=>{
	console.log("arnon server is runing")
});

let db = new sqlite3.Database('./database/chatDB.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err)=>{
    if(err) throw err;

    console.log('Connected to database.');

    

    var wsList = [];
    var roomList = [];
    ws.on("connection", (ws)=>{
    
            //Lobby
            console.log("client connected.");
            //Reception
            ws.on("message", (data)=>{
                console.log("send from client :"+ data);

                //========== Convert jsonStr into jsonObj =======

            

                // I change to line below for prevent confusion
                var toJsonObj = { 
                    eventName:"",
                    data:""
                    
                }
            //toJsonObj = JSON.parse(data);
            //===============================================
            toJsonObj = JSON.parse(data);
            //===============================================
            //var dataFromClient = {
            //    eventName:"",
            //    data:"",
                
           // }
        
            var splitStr = toJsonObj.data.split('#');
            var UserID = splitStr[0];
            var Password = splitStr[1];
            var Name = splitStr[2];
        
            var sqlSelect = "SELECT * FROM UserData WHERE UserID='"+UserID+"' AND Password='"+Password+"'";//Login
            var sqlInsert = "INSERT INTO UserData (UserID, Password, Name, Money) VALUES('"+UserID+"', '"+Password+"','"+Name+"', '0')";//Register
            
            if(toJsonObj.eventName == "Login")
            {
        
                db.all(sqlSelect, (err, rows)=>{
                    if(err)
                    {
                        console.log("[0]" + err);
                    }
                    else
                    {
                       if(rows.length > 0)
                       {
                           console.log("======[1]======");
                           console.log(rows);
                           console.log("======[1]======");
                           var callbackMsg = {
                               eventName: "Login",
                               data:"success"
                           }
            
                           var toJonStr = JSON.stringify(callbackMsg);
                           ws.send(toJsonStr);
                           console.log("[2]" + toJonStr);
                       }
                       else
                       {
                            var callbackMsg = {
                                eventName: "Login",
                                data:"fail"
                            }  
            
                            var toJonStr = JSON.stringify(callbackMsg);
                            ws.send(toJsonStr);
                            console.log("[3]" +toJonStr);
                       }
                    }
                })
            } 
            
            if(toJsonObj.eventName == "Register")
            {
        
                db.all(sqlInsert, (err, rows)=>{
                    if(err)
                    {
                        var callbackMsg = {
                            eventName:"Register",
                            data:"fail"
                        }
        
                        var toJsonStr = JSON.stringify(callbackMsg);
                        ws.send(toJsonStr);
                        console.log("[0]" +toJsonStr);
                    }
                    else
                    {
                        var callbackMsg = {
                            eventName:"Register",
                            data:"success"
                        }
        
                        var toJsonStr = JSON.stringify(callbackMsg);
                        ws.send(toJsonStr);
                        console.log("[1]" +toJsonStr);
                        
                    }
                })
            }   
             
            if(toJsonObj.eventName == "CreateRoom")//CreateRoom
            {
             //============= Find room with roomName from Client =========
                var isFoundRoom = false;
                for(var i = 0; i < roomList.length; i++)
             {
                if(roomList[i].roomName == toJsonObj.data)
                {
                    isFoundRoom = true;
                    break;
                }
             }
             //===========================================================

                if(isFoundRoom == true)// Found room
                {
                 //Can't create room because roomName is exist.
                    //========== Send callback message to Client ============

                 //ws.send("CreateRoomFail"); 

                    //I will change to json string like a client side. Please see below
                    var callbackMsg = {
                     eventName:"CreateRoom",
                     data:"fail"
                    }
                    var toJsonStr = JSON.stringify(callbackMsg);
                    ws.send(toJsonStr);
                    //=======================================================

                    console.log("client create room fail.");
                }
                else
                {
                    //============ Create room and Add to roomList ==========
                    var newRoom = {
                        roomName: toJsonObj.data,
                        wsList: []
                }

                    newRoom.wsList.push(ws);

                    roomList.push(newRoom);
                    //=======================================================

                    //========== Send callback message to Client ============

                    //ws.send("CreateRoomSuccess");

                    //I need to send roomName into client too. I will change to json string like a client side. Please see below
                    var callbackMsg = {
                        eventName:"CreateRoom",
                        data:toJsonObj.data
                    }
                    var toJsonStr = JSON.stringify(callbackMsg);
                    ws.send(toJsonStr);
                    //=======================================================
                    console.log("client create room success.");
                }

                //console.log("client request CreateRoom ["+toJsonObj.data+"]");
            
            }
            else if(toJsonObj.eventName == "JoinRoom")//JoinRoom
            {
			    var isFoundRoom = false;
                for(var i = 0; i < roomList.length; i++)
                {
                    if(roomList[i].roomName == toJsonObj.data)
                    {
                        isFoundRoom = true;
                        roomList[i].wsList.push(ws);
                        break;
                    }
                }
                if(isFoundRoom == true)
                {
                    var callbackMsg = 
                    {
                        eventName:"JoinRoom",

                        data:"success"
                    }

                    var toJsonStr = JSON.stringify(callbackMsg);

                    ws.send(toJsonStr);

                    console.log("client request JoinRoom["+toJsonObj.data+"]");
                }
                else
                {
                    var callbackMsg = 
                    {
                        eventName:"JoinRoom",
                        data:"fail"
                    }
                    var toJsonStr = JSON.stringify(callbackMsg);

                    ws.send(toJsonStr);

                    console.log("client JoinRoom success");

                    console.log("client request JoinRoom["+toJsonObj.data+"]");

                    //console.log("client joinroom fail");
                    //roomList[i].wsList.push(ws);
                }
                console.log("client request JoinRoom");
                //========================================
            }
            else if(toJsonObj.eventName == "LeaveRoom")//LeaveRoom
            {
                //============ Find client in room for remove client out of room ================
                var isLeaveSuccess = false;//Set false to default.
                for(var i = 0; i < roomList.length; i++)//Loop in roomList
                {
                    for(var j = 0; j < roomList[i].wsList.length; j++)//Loop in wsList in roomList
                    {
                        if(ws == roomList[i].wsList[j])//If founded client.
                        {
                            roomList[i].wsList.splice(j, 1);//Remove at index one time. When found client.

                            if(roomList[i].wsList.length <= 0)//If no one left in room remove this room now.
                            {
                                roomList.splice(i, 1);//Remove at index one time. When room is no one left.
                            }
                            isLeaveSuccess = true;
                            break;
                        }
                    }
                }
                //===============================================================================

                if(isLeaveSuccess)
                {
                    //========== Send callback message to Client ============

                    //ws.send("LeaveRoomSuccess");

                    //I will change to json string like a client side. Please see below
                    var callbackMsg = {
                        eventName:"LeaveRoom",
                        data:"success"
                    }
                    var toJsonStr = JSON.stringify(callbackMsg);
                    ws.send(toJsonStr);
                    //=======================================================

                    console.log("leave room success");
                }
                else
                {
                    //========== Send callback message to Client ============

                    //ws.send("LeaveRoomFail");

                    //I will change to json string like a client side. Please see below
                    var callbackMsg = {
                        eventName:"LeaveRoom",
                        data:"fail"
                    }
                    var toJsonStr = JSON.stringify(callbackMsg);
                    ws.send(toJsonStr);
                    //=======================================================

                    console.log("leave room fail");
                }
            }
        });


    /*wsList.push(ws);
    
    ws.on("message", (data)=>{
        console.log("send from client :"+ data);
        Boardcast(data);
    });
    */
        ws.on("close", ()=>{
            console.log("client disconnected.");

            //============ Find client in room for remove client out of room ================
            for(var i = 0; i < roomList.length; i++)//Loop in roomList
            {
                for(var j = 0; j < roomList[i].wsList.length; j++)//Loop in wsList in roomList
                {
                    if(ws == roomList[i].wsList[j])//If founded client.
                    {
                        roomList[i].wsList.splice(j, 1);//Remove at index one time. When found client.

                        if(roomList[i].wsList.length <= 0)//If no one left in room remove this room now.
                        {
                            roomList.splice(i, 1);//Remove at index one time. When room is no one left.
                        }
                        break;
                    }
                }
            }
            //===============================================================================
        });
    });

    function Boardcast(data)
    {
    /*for(var i = 0; i < wsList.length; i++)
    {
        wsList[i].send(data);
    }*/
    }
})  