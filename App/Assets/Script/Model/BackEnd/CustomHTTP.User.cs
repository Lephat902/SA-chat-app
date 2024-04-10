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
}

public struct UserFailRequest
{
    public string message;
}


public static partial class CustomHTTP
{
    public static async void GetProfileByName(string userName, Action<UserDataModel> result, Action<UserFailRequest> error)
    {
        var url = CustomHTTP.DOMAIN + $"/users/username/{userName}/profile";
        var response = await GET(url);

        Debug.Log("Result: " + response.message);

        if (!response.isSuccess)
            error.Invoke(JsonUtility.FromJson<UserFailRequest>(response.message));
        else
            result.Invoke(JsonUtility.FromJson<UserDataModel>(response.message));
    }

    public static async void GetProfileByID(string userId, Action<UserDataModel> result, Action<UserFailRequest> error)
    {
        var url = CustomHTTP.DOMAIN + $"/users/id/{userId}/profile";
        var response = await GET(url);

        Debug.Log("Result: " + response.message);

        if (!response.isSuccess)
            error.Invoke(JsonUtility.FromJson<UserFailRequest>(response.message));
        else
            result.Invoke(JsonUtility.FromJson<UserDataModel>(response.message));
    }
}
