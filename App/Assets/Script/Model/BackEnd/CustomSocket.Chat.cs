using System;
using System.Collections.Generic;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[Serializable]
public struct ChatCreate
{
    public string conversationId;
    public List<string> membersIdsList;
}

[Serializable]
public struct ChatReceive
{
    public string id;
    public string text;
    public string conversationId;
    public string userId;
    public string createdAt;
}

partial class CustomSocket : MonoBehaviour
{
    private void StartChat()
    {
        socket.OnUnityThread("conversation-created",
            res => HandleConversationCreated(JsonUtility.FromJson<ChatCreate>(res.ToString())));

        socket.OnUnityThread("receive-message",
            res => HandleReceiveMessage(JsonUtility.FromJson<ChatReceive>(res.ToString())));
    }

    private void HandleConversationCreated(ChatCreate chatCreate)
    {
        ChatController.OnConversationCreate.Invoke(new ConversationDataModel()
        {
            id = chatCreate.conversationId,
            users = chatCreate.membersIdsList
        });
    }

    private void HandleReceiveMessage(ChatReceive chatReceive)
    {
        ChatController.OnChatMessageRecieve.Invoke(
            chatReceive.conversationId,
            new ChatDataModel()
            {
                id = chatReceive.userId,
                user = "Chim",
                conversation = chatReceive.text,
                lastReadMessage = "Chim"
            });
    }

    public static void SendChatMessage(string conversationId, string text)
    {
        var message = string.Format("{\"text\": {0}, \"conversationId\": {1}}", text, conversationId);
        Debug.Log("Send message: " + message);
        socket.EmitStringAsJSON("send-message", message);
    }
}
