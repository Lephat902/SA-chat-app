using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class AddFriendItemView : FriendItemView
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private FriendDataAsset friendDataAsset;
    [SerializeField] private Button addFriendButton;

    private void Start()
    {
        addFriendButton.onClick.AddListener(AddFriend);
    }

    private void OnDestroy()
    {
        addFriendButton.onClick.RemoveAllListeners();
    }

    public override void SetUI(FriendDataModel friendDataModel)
    {
        base.SetUI(friendDataModel);
        addFriendButton.gameObject.SetActive(true);
    }

    private void AddFriend()
    {
        CustomHTTP.SendRequestFriend(userDataAsset.AccessToken, friendDataModel.id,
            (result) =>
            {
                addFriendButton.gameObject.SetActive(false);
            });
    }
}
