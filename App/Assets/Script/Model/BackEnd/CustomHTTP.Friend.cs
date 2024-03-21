using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

[Serializable]
public struct FriendDataModel
{
    public string id;
    public string username;
    public string avatar;
    public bool isOnline;
}

[Serializable]
public struct SearchFriendDataModel
{
    public List<FriendDataModel> results;
    public int totalCount;
}

public struct FriendFailRequest
{
    public List<string> message;
}


public static partial class CustomHTTP
{
    public static async void GetFriend(string accessToken, Action<List<FriendDataModel>> result, Action<FriendFailRequest> error)
    {
        var url = DOMAIN + $"/users/friends";
        var response = await GET(url, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content + " " + content.Length);

        if (content.Length <= 2)
        {
            result.Invoke(new List<FriendDataModel>());
            return;
        }


        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<FriendFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<List<FriendDataModel>>(content));
    }

    public static async void SearchFriend(string searchString, Action<List<FriendDataModel>> result, Action<FriendFailRequest> error)
    {
        var url = DOMAIN + $"/users";

        var response = await GET(url + $"?page=1&limit=10&q={searchString}");

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<FriendFailRequest>(content));
        else
        {
            var data = JsonUtility.FromJson<SearchFriendDataModel>(content);
            if (data.totalCount == 0)
                result.Invoke(new List<FriendDataModel>());
            else
                result.Invoke(data.results);
        }
    }

    public static async void GetRequestFriend(string accessToken, Action<List<FriendDataModel>> result, Action<FriendFailRequest> error)
    {
        var url = DOMAIN + $"/users/received-requests";
        var response = await GET(url, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (content.Length <= 2)
        {
            result.Invoke(new List<FriendDataModel>());
            return;
        }

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<FriendFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<List<FriendDataModel>>(content));
    }
}
