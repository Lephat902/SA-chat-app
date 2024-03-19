using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

[Serializable]
public struct UserDataModel
{
    public string accessToken;
    public string id;
    public string username;
    public string password;
    public string avatar;
    public bool isOnline;

    public List<FriendRequestModel> sentFriendRequests;
    public List<FriendRequestModel> receivedFriendRequests;
}

[Serializable]
public struct FriendRequestModel
{
    public string id;
    public string requester;
    public string recipient;
    public string createdAt;
    public string status;
    public string updatedAt;
}

public struct UserFailRequest
{
    public string message;
}


public static partial class CustomHTTP
{
    public static async void Profile(string url, Action<UserDataModel> result, Action<UserFailRequest> error)
    {
        var response = await GET(url);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<UserFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<UserDataModel>(content));
    }
}
