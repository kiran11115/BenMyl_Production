import * as signalR from "@microsoft/signalr";

let connection = null;

export const startConnection = async (userId) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`https://webapidev.benmyl.com/chatHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("✅ SignalR Connected");
  } catch (err) {
    console.error("❌ SignalR Connection Error: ", err);
  }

  return connection;
};

export const getConnection = () => connection;
