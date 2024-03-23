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

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<UserFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<UserDataModel>(content));
    }

    public static async void GetProfileByID(string userId, Action<UserDataModel> result, Action<UserFailRequest> error)
    {
        var url = CustomHTTP.DOMAIN + $"/users/username/{userId}/profile";
        var response = await GET(url);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<UserFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<UserDataModel>(content));
    }
}
