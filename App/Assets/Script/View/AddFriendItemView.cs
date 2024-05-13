using Cysharp.Threading.Tasks;
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
    [SerializeField] private GameObject fxButtonClick;

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

    private async void AddFriend()
    {
        if (!fxButtonClick.activeInHierarchy)
            fxButtonClick.SetActive(true);
        else
        {
            fxButtonClick.SetActive(false);
            await UniTask.DelayFrame(1);
            fxButtonClick.SetActive(true);
        }

        CustomHTTP.SendRequestFriend(userDataAsset.AccessToken, friendDataModel.id,
            (result) =>
            {
                addFriendButton.gameObject.SetActive(false);
            });
    }
}
