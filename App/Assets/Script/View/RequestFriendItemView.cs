using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class RequestFriendItemView : FriendItemView
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private FriendDataAsset friendDataAsset;
    [SerializeField] private Button acceptButton;
    [SerializeField] private Button refuseButton;
    private string requestId;

    private void Start()
    {
        acceptButton.onClick.AddListener(AcceptRequestFriend);
        refuseButton.onClick.AddListener(RefuseRequestFriend);
    }

    private void OnDestroy()
    {
        acceptButton.onClick.RemoveAllListeners();
        refuseButton.onClick.RemoveAllListeners();
    }

    public void SetUI(FriendDataModel friendDataModel, string idRequest)
    {
        base.SetUI(friendDataModel);
        requestId = idRequest;
    }

    private void AcceptRequestFriend()
    {
        CustomHTTP.AcceptRequestFriend(userDataAsset.AccessToken, requestId,
            (result) =>
            {
                if (result)
                    FriendController.OnAcceptRequest.Invoke(requestId);
            });
    }

    private void RefuseRequestFriend()
    {
        CustomHTTP.RefuseRequestFriend(userDataAsset.AccessToken, requestId,
           (result) =>
           {
               Debug.Log(result);
               if (result)
                   FriendController.OnRefuseRequest.Invoke(requestId);
           });
    }
}
