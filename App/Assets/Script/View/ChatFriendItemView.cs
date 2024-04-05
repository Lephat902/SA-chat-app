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
                    name = "chim",
                    description = "chim",
                    avatar = "chim.com",
                    initialMembers = new() { friendDataModel.id }
                },
                () => Chat());
        else
            ChatController.OnConversationOpen.Invoke(existConversationId);
    }

    private string CheckExistConversation(string otherId)
    {
        for (int i = 0; i < chatDataAsset.ConversationList.Count; i++)
        {
            var conversationData = chatDataAsset.ConversationList[i];
            if (conversationData.users.Count == 2
                && conversationData.users.Contains(userDataAsset.UserDataModel.id)
                && conversationData.users.Contains(otherId))
                return conversationData.id;
        }

        return string.Empty;
    }
}
