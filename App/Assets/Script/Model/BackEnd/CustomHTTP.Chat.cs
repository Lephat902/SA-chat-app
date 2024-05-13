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
    public static async void CreateConversation(string accessToken, CreateConversationDataModel createConversationDataModel, Action<HeaderConversationDataModel> result)
    {
        var url = DOMAIN + "/conversations/groups";
        var response = await POST(url, createConversationDataModel, accessToken);

        if (!response.isSuccess)
            Debug.LogError("Can't create conversation: " + response.message);
        else
            result.Invoke(JsonUtility.FromJson<HeaderConversationDataModel>(response.message));
    }

    public static async void GetConversation(string accessToken, Action<List<HeaderConversationDataModel>> result, Action error)
    {
        var url = DOMAIN + $"/conversations";
        var response = await GET(url + $"?page=1&limit=10", accessToken);

        Debug.Log("Result: " + response.message);

        if (!response.isSuccess)
            error.Invoke();
        else
            result.Invoke(CustomJson<HeaderConversationDataModel>.ParseList(response.message));
    }

    public static async void GetHeaderConversation(string accessToken, string conversationId, Action<HeaderConversationDataModel> result, Action error)
    {
        var url = DOMAIN + $"/conversations/";
        var response = await GET(url + conversationId, accessToken);

        Debug.Log("Result: " + response.message);

        if (!response.isSuccess)
            error.Invoke();
        else
            result.Invoke(JsonUtility.FromJson<HeaderConversationDataModel>(response.message));
    }

    public static async void GetMessageConversation(string accessToken, string conversationId, Action<List<MessageConversationDataModel>> result, Action error)
    {
        var url = DOMAIN + $"/conversations/";
        var response = await GET(url + conversationId + "/messages?limit=20&dir=DESC", accessToken);

        Debug.Log("Result: " + response.message);

        if (!response.isSuccess)
            error.Invoke();
        else
            result.Invoke(CustomJson<MessageConversationDataModel>.ParseList(response.message));
    }

    public static async void AddToConversation(string accessToken, string conversationId, string userId, Action result)
    {
        var url = DOMAIN + "/conversations/groups/" + conversationId + "/members/" + userId;
        var response = await POST(url, null, accessToken);

        if (!response.isSuccess)
            Debug.LogError("Can't add member: " + response.message);
        else
            result.Invoke();
    }
}
