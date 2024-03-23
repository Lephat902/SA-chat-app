using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

[Serializable]
public struct ListFriendDataModel
{
    public List<FriendDataModel> list;
}

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

[Serializable]
public struct ListRequestDataModel
{
    public List<RequestDataModel> list;
}

[Serializable]
public struct RequestDataModel
{
    public string id;
    public FriendDataModel requester;
}

[Serializable]
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

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<FriendFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<ListFriendDataModel>("{ \"list\": " + content + "}").list);
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

    public static async void GetRequestFriend(string accessToken, Action<List<RequestDataModel>> result, Action<FriendFailRequest> error)
    {
        var url = DOMAIN + $"/users/received-requests";
        var response = await GET(url, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            error.Invoke(JsonUtility.FromJson<FriendFailRequest>(content));
        else
            result.Invoke(JsonUtility.FromJson<ListRequestDataModel>("{ \"list\": " + content + "}").list);
    }

    public static async void SendRequestFriend(string accessToken, string id, Action<bool> result)
    {
        var url = DOMAIN + $"/users/friend-requests/{id}";
        var response = await POST(url, null, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            result.Invoke(false);
        else
            result.Invoke(true);
    }

    public static async void AcceptRequestFriend(string accessToken, string id, Action<bool> result)
    {
        var url = DOMAIN + $"/users/received-requests/{id}/accept";
        var response = await PUT(url, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            result.Invoke(false);
        else
            result.Invoke(true);
    }

    public static async void RefuseRequestFriend(string accessToken, string id, Action<bool> result)
    {
        var url = DOMAIN + $"/users/received-requests/{id}/reject";
        var response = await PUT(url, accessToken);

        var content = await response.Content.ReadAsStringAsync();

        Debug.Log("Result: " + content);

        if (!response.IsSuccessStatusCode)
            result.Invoke(false);
        else
            result.Invoke(true);
    }
}
