const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database/chatDB.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err)=>{
    if(err) throw err;

    console.log('Connected to database.');

    var dataFromClient = {
        eventName:"",
        data:""
    }

    var splitStr = dataFromClient.data.split('#');
    var UserID = splitStr[0];
    var Password = splitStr[1];
    var Name = splitStr[2];

    var sqlSelect = "SELECT * FROM UserData WHERE UserID='"+UserID+"' AND Password='"+Password+"'";//Login
    var sqlInsert = "INSERT INTO UserData (UserID, Password, Name, Money) VALUES('"+UserID+"', '"+Password+"','"+Name+"', '0')";//
    
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
                console.log("[0]" +toJsonStr);
            }
            else
            {
                var callbackMsg = {
                    eventName:"Register",
                    data:"success"
                }

                var toJsonStr = JSON.stringify(callbackMsg);
                console.log("[1]" +toJsonStr);
                
            }
        })
    }    
    /*db.all(sqlSelect, (err, rows)=>{
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
                   data:rows[0].Name
               }

               var toJonStr = JSON.stringify(callbackMsg);
               console.log("[2]" + toJonStr);
           }
           else
           {
                var callbackMsg = {
                    eventName: "Login",
                    data:"fail"
                }  

                var toJonStr = JSON.stringify(callbackMsg);
                console.log("[3]" +toJonStr);
           }
        }
    })*/
})