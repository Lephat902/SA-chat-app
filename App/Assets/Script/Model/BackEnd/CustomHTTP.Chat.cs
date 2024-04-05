using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

[Serializable]
public struct CreateConversationDataModel
{
    public string name;
    public string description;
    public string avatar;
    public List<string> initialMembers;
}

[Serializable]
public struct ConversationDataModel
{
    public string id;
    public string createdAt;
    public string name;
    public string description;
    public string avatar;
    public List<ConversationUserDataModel> users;
    public List<string> messages;
    public List<ChatDataModel> userConversations;
}

[Serializable]
public struct ChatDataModel
{
    public string id;
    public string user;
    public string conversation;
    public string lastReadMessage;
}

[Serializable]
public struct ConversationUserDataModel
{
    public string id;
    public string username;
    public string avatar;
    public bool isOnline;
}


public static partial class CustomHTTP
{
    public static async void CreateConversation(string accessToken, CreateConversationDataModel createConversationDataModel, Action result)
    {
        var url = DOMAIN + "/conversations/groups";
        var response = await POST(url, createConversationDataModel, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            Debug.LogError("Can't create conversation: " + content);
        else
            Debug.Log("Create conversation success: " + content);
    }

    public static async void GetConversation(string accessToken, Action<List<ConversationDataModel>> result, Action error)
    {
        var url = DOMAIN + $"/conversations";
        var response = await GET(url + $"?page=1&limit=10", accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke();
        else
            result.Invoke(CustomJson<ConversationDataModel>.ParseList(content));
    }

    public static async void GetConversation(string accessToken, string conversationId, Action<ConversationDataModel> result, Action error)
    {
        var url = DOMAIN + $"/conversations/";
        var response = await GET(url + conversationId, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke();
        else
            result.Invoke(JsonUtility.FromJson<ConversationDataModel>(content));
    }
}
