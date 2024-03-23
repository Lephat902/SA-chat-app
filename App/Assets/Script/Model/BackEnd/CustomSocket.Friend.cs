using System;
using System.Collections.Generic;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public struct FriendMessageRequest
{
    public string requestId;
    public string requesterId;
    public string recipientId;
    public string createdAt;
}

public struct FriendMessageUpdate
{
    public string requestId;
    public string requesterId;
    public string recipientId;
    public string updatedAt;
    public string newStatus;
}

partial class CustomSocket : MonoBehaviour
{
    private void StartFriend()
    {
        socket.On("FriendRequestCreatedEvent", (response) =>
        {
            HandleFriendMessageRequest(JsonUtility.FromJson<FriendMessageRequest>(res.ToString()));
        });

        socket.On("friend-request-sent",
            res => HandleFriendMessageRequest(JsonUtility.FromJson<FriendMessageRequest>(res.ToString())));

        socket.On("friend-request-updated",
            res => HandleFriendMessageUpdate(JsonUtility.FromJson<FriendMessageUpdate>(res.ToString())));
    }

    private void HandleFriendMessageRequest(FriendMessageRequest friendMessageRequest)
    {
        Debug.LogError("chim");
        if (friendMessageRequest.recipientId == userDataAsset.UserDataModel.id)
            FriendController.OnIsAddedRequest.Invoke(friendMessageRequest.requesterId);
    }

    private void HandleFriendMessageUpdate(FriendMessageUpdate friendMessageRequest)
    {
        if (friendMessageRequest.recipientId == userDataAsset.UserDataModel.id)
        {
            switch (friendMessageRequest.newStatus)
            {
                case "ACCEPTED":
                    FriendController.OnIsAcceptedRequest.Invoke(friendMessageRequest.requesterId);
                    break;
                case "REJECTED":
                    FriendController.OnIsRefusedRequest.Invoke(friendMessageRequest.requesterId);
                    break;
                default:
                    break;
            }
        }
    }
}
