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
    public string userId;
    public string conversationId;
    public string text;
    public string createdAt;
}

partial class CustomSocket : MonoBehaviour
{
    private void StartChat()
    {
        socket.OnUnityThread("conversation-created",
            res => HandleConversationCreated(CustomJson<ChatCreate>.ParseList(res.ToString())[0]));

        socket.OnUnityThread("receive-message",
            res => HandleReceiveMessage(CustomJson<ChatReceive>.ParseList(res.ToString())[0]));
    }

    private void HandleConversationCreated(ChatCreate chatCreate)
    {
        CustomHTTP.GetHeaderConversation(userDataAsset.AccessToken,
                                    chatCreate.conversationId,
                                    (res) => { ChatController.OnConversationCreate.Invoke(res); },
                                    () => { Debug.LogError("Can't Load Conversation"); });
    }

    private void HandleReceiveMessage(ChatReceive chatReceive)
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
        var message = "{\"text\": \"" + text + "\", \"conversationId\": \"" + conversationId + "\"}";
        socket.EmitStringAsJSON("send-message", message);
    }
}
