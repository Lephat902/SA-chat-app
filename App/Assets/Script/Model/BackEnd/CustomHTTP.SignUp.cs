using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public struct FailRequest
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
    public static async void SignUp(string url, object data, Action result, Action<FailRequest> error)
    {
        var response = await POST(url, data);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + JsonUtility.ToJson(content));

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<FailRequest>(content));
        else
            result.Invoke();
    }
}
