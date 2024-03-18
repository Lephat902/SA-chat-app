using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public struct LoginSuccessRequest
{
    public string accessToken;
}

public struct LoginFailRequest
{
    public List<string> message;
}

public struct SignUpModel
{
    public string username;
    public string password;
    public string avatar;
}

public struct SignInModel
{
    public string username;
    public string password;
}


public static partial class CustomHTTP
{
    public static async void SignUp(string url, object data, Action<LoginSuccessRequest> result, Action<LoginFailRequest> error)
    {
        var response = await POST(url, data);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<LoginFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<LoginSuccessRequest>(content));
    }
}
