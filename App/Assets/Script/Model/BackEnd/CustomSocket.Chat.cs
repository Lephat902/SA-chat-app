using System;
using Cysharp.Threading.Tasks;
using UnityEngine;
using NativeWebSocket;
using System.Collections.Generic;
using UnityEngine.Events;

[Serializable]
public struct SocketChatSendEvent
{
    public string @event;
    public SocketChatSendEventData data;
}

[Serializable]
public struct SocketChatSendEventData
{
    public string conversationId;
    public string text;
}

[Serializable]
public struct SocketChatCreateEvent
{
    public string @event;
    public SocketChatCreateEventData data;
}

[Serializable]
public struct SocketChatCreateEventData
{
    public string conversationId;
    public List<string> membersIdsList;
}

[Serializable]
public struct SocketChatReceiveEvent
{
    public string @event;
    public SocketChatReceiveEventData data;
}

[Serializable]
public struct SocketChatReceiveEventData
{
    public string id;
    public string userId;
    public string conversationId;
    public string text;
    public string createdAt;
}



partial class CustomSocket : MonoBehaviour
{
    private void StartChat(WebSocket socketParam)
    {
        /*socket.OnUnityThread("conversation-created",
            res => HandleConversationCreated(CustomJson<ChatCreate>.ParseList(res.ToString())[0]));

        socket.OnUnityThread("receive-message",
            res => HandleReceiveMessage(CustomJson<ChatReceive>.ParseList(res.ToString())[0]));*/

        socketParam.OnMessage -= RegisterChat;
        socketParam.OnMessage += RegisterChat;
    }

    private void RegisterChat(byte[] bytes)
    {
        var message = System.Text.Encoding.UTF8.GetString(bytes);
        Debug.Log("Received OnMessage! (" + bytes.Length + " bytes) " + message);
        HandleMessageChat(message);
    }

    private void HandleMessageChat(string message)
    {
        var socketChatCreateEventData = JsonUtility.FromJson<SocketChatCreateEvent>(message);
        if (socketChatCreateEventData.@event == "conversation-created")
            HandleConversationCreated(socketChatCreateEventData.data);

        var socketChatReceiveEventData = JsonUtility.FromJson<SocketChatReceiveEvent>(message);
        if (socketChatReceiveEventData.@event == "receive-message")
            HandleReceiveMessage(socketChatReceiveEventData.data);
    }

    private void HandleConversationCreated(SocketChatCreateEventData chatCreate)
    {
        CustomHTTP.GetHeaderConversation(userDataAsset.AccessToken,
                                    chatCreate.conversationId,
                                    (res) => { ChatController.OnConversationCreate.Invoke(res); },
                                    () => { Debug.LogError("Can't Load Conversation"); });
    }

    private void HandleReceiveMessage(SocketChatReceiveEventData chatReceive)
    {
        ChatController.OnChatMessageRecieve.Invoke(
            chatReceive.conversationId,
            new MessageConversationDataModel()
            {
                id = chatReceive.id,
                userId = chatReceive.userId,
                text = chatReceive.text,
                createdAt = chatReceive.createdAt
            });
    }

    public static void SendChatMessage(string conversationId, string text)
    {
        var message = JsonUtility.ToJson(new SocketChatSendEvent()
        {
            @event = "send-message",
            data = new SocketChatSendEventData() { conversationId = conversationId, text = text }
        });

        Debug.Log("Send message: " + message);
        //socket.EmitStringAsJSON("send-message", message);

        socket.SendText(message); 
    }
}
