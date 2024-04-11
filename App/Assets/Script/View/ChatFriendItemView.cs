using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ChatFriendItemView : FriendItemView
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private ChatDataAsset chatDataAsset;
    [SerializeField] private Button chatBtn;

    private void Start()
    {
        chatBtn.onClick.AddListener(Chat);
    }

    private void OnDestroy()
    {
        chatBtn.onClick.RemoveAllListeners();
    }

    private void Chat()
    {
        var existConversationId = CheckExistConversation(friendDataModel.id);

        if (existConversationId == string.Empty)
            CustomHTTP.CreateConversation(userDataAsset.AccessToken,
                new CreateConversationDataModel()
                {
                    name = friendDataModel.username,
                    description = "chim",
                    avatar = "chim.com",
                    initialMembers = new() { friendDataModel.id }
                },
                (res) =>
                {
                    ChatController.OnConversationCreate.Invoke(res);
                    ChatController.OnConversationOpen.Invoke(res.id);
                });
        else
            ChatController.OnConversationOpen.Invoke(existConversationId);
    }

    private string CheckExistConversation(string otherId)
    {
        foreach(var conversationData in chatDataAsset.ConversationList)
        {
            var data = conversationData.Key;
            int check = 0;
            if (data.users.Count == 2)
                for (int j = 0; j < data.users.Count; j++)
                    if (data.users[j].id == userDataAsset.UserDataModel.id || data.users[j].id == otherId)
                        check++;
            
            if (check == 2)
                return data.id;
        }

        return string.Empty;
    }
}
