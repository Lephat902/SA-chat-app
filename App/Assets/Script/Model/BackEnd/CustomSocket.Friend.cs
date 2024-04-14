using System;
using Cysharp.Threading.Tasks;
using UnityEngine;
using NativeWebSocket;
using System.Collections.Generic;
using UnityEngine.Events;

[Serializable]
public struct SocketFriendRequestEvent
{
    public string @event;
    public FriendMessageRequest data;
}

[Serializable]
public struct FriendMessageRequest
{
    public string requestId;
    public string requesterId;
    public string recipientId;
    public string createdAt;
}

[Serializable]
public struct SocketFriendUpdateEvent
{
    public string @event;
    public FriendMessageUpdate data;
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
    private void StartFriend(WebSocket socketParam)
    {
        /*socket.OnUnityThread("friend-request-sent",
            res =>HandleFriendMessageRequest(CustomJson<FriendMessageRequest>.ParseList(res.ToString())[0]));

        socket.OnUnityThread("friend-request-updated",
            res => HandleFriendMessageUpdate(CustomJson<FriendMessageUpdate>.ParseList(res.ToString())[0]));*/

        socketParam.OnMessage += (bytes) =>
        {
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            HandleMessageFriend(message);
        };
    }

    private void HandleMessageFriend(string message)
    {
        var socketFriendRequestEventData = JsonUtility.FromJson<SocketFriendRequestEvent>(message);
        if (socketFriendRequestEventData.@event == "friend-request-sent")
            HandleFriendMessageRequest(socketFriendRequestEventData.data);

        var socketFriendUpdateEventData = JsonUtility.FromJson<SocketFriendUpdateEvent>(message);
        if (socketFriendUpdateEventData.@event == "friend-request-updated")
            HandleFriendMessageUpdate(socketFriendUpdateEventData.data);
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
