using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ChatFriendItemView : FriendItemView
{
    [SerializeField] private UserDataAsset userDataAsset;
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
        CustomHTTP.CreateConversation(userDataAsset.AccessToken,
            new CreateConversationDataModel()
            {
                name = "chim",
                description = "chim",
                avatar = "chim.com",
                initialMembers = new() { friendDataModel.id }
            },
            () =>
            {
                //ChatController.OnConversationOpen.Invoke();
            });
    }
}
