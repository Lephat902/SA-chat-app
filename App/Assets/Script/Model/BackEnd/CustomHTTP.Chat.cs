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
public struct HeaderConversationDataModel
{
    public string id;
    public string createdAt;
    public string name;
    public string description;
    public string avatar;
    public List<ConversationUserDataModel> users;
}

[Serializable]
public struct MessageConversationDataModel
{
    public string id;
    public string userId;
    public string text;
    public string createdAt;
    public List<string> lastReadUsers;
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

    public static async void GetConversation(string accessToken, Action<List<HeaderConversationDataModel>> result, Action error)
    {
        var url = DOMAIN + $"/conversations";
        var response = await GET(url + $"?page=1&limit=10", accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke();
        else
            result.Invoke(CustomJson<HeaderConversationDataModel>.ParseList(content));
    }

    public static async void GetHeaderConversation(string accessToken, string conversationId, Action<HeaderConversationDataModel> result, Action error)
    {
        var url = DOMAIN + $"/conversations/";
        var response = await GET(url + conversationId, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke();
        else
            result.Invoke(JsonUtility.FromJson<HeaderConversationDataModel>(content));
    }

    public static async void GetMessageConversation(string accessToken, string conversationId, Action<List<MessageConversationDataModel>> result, Action error)
    {
        var url = DOMAIN + $"/conversations/";
        var response = await GET(url + conversationId + "/messages?limit=10&dir=DESC", accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke();
        else
            result.Invoke(CustomJson<MessageConversationDataModel>.ParseList(content));
    }
}
