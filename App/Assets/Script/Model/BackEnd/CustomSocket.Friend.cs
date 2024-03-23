using System;
using System.Collections.Generic;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[Serializable]
public struct FriendMessageRequest
{
    public string requestId;
    public string requesterId;
    public string recipientId;
    public string createdAt;
}

[Serializable]
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
        socket.OnUnityThread("friend-request-sent",
            res =>HandleFriendMessageRequest(CustomJson<FriendMessageRequest>.ParseList(res.ToString())[0]));

        socket.OnUnityThread("friend-request-updated",
            res => HandleFriendMessageUpdate(CustomJson<FriendMessageUpdate>.ParseList(res.ToString())[0]));
    }

    private void HandleFriendMessageRequest(FriendMessageRequest friendMessageRequest)
    {
        if (friendMessageRequest.recipientId == userDataAsset.UserDataModel.id)
            FriendController.OnIsAddedRequest.Invoke(friendMessageRequest.requestId, friendMessageRequest.requesterId);
    }

    private void HandleFriendMessageUpdate(FriendMessageUpdate friendMessageRequest)
    {
        if (friendMessageRequest.requesterId == userDataAsset.UserDataModel.id)
        {
            switch (friendMessageRequest.newStatus)
            {
                case "ACCEPTED":
                    FriendController.OnIsAcceptedRequest.Invoke(friendMessageRequest.recipientId);
                    break;
                case "REJECTED":
                    FriendController.OnIsRefusedRequest.Invoke(friendMessageRequest.recipientId);
                    break;
                default:
                    break;
            }
        }
    }
}
