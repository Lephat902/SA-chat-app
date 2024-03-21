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

    private void AddFriend()
    {
        CustomHTTP.SendRequestFriend(userDataAsset.AccessToken, friendDataModel.id,
            (result) =>
            {
                foreach (var friendDataModel in friendDataAsset.RequestList)
                {
                    if (friendDataModel.id == this.friendDataModel.id)
                    {
                        friendDataAsset.RequestList.Remove(friendDataModel);
                        addFriendButton.gameObject.SetActive(false);
                        return;
                    }
                }
            });
    }
}
