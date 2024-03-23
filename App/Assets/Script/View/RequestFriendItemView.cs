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

    public void SetID(string id) => requestId = id;

    private void AcceptRequestFriend()
    {
        CustomHTTP.AcceptRequestFriend(userDataAsset.AccessToken, requestId,
            (result) =>
            {
                FriendController.OnAcceptRequest.Invoke(requestId);
                gameObject.SetActive(false);
            });
    }

    private void RefuseRequestFriend()
    {
        CustomHTTP.RefuseRequestFriend(userDataAsset.AccessToken, requestId,
           (result) =>
           {
               FriendController.OnRefuseRequest.Invoke(requestId);
               gameObject.SetActive(false);
           });
    }
}
