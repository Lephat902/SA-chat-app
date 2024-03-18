using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public struct UserSuccessRequest
{
    public string accessToken;
    public string id;
    public string username;
    public string password;
    public string avatar;
    public bool isOnline;

    public List<FriendRequest> sentFriendRequests;
    public List<FriendRequest> receivedFriendRequests;
}

public struct FriendRequest
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
    string message;
}


public static partial class CustomHTTP
{
    public static async void Profile(string url, object data, Action<UserSuccessRequest> result, Action<UserFailRequest> error)
    {
        var response = await GET(url);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<UserFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<UserSuccessRequest>(content));
    }
}
