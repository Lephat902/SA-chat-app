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

    private void AcceptRequestFriend()
    {
        CustomHTTP.AcceptRequestFriend(userDataAsset.AccessToken, friendDataModel.id,
            (result) =>
            {
                foreach(var friendDataModel in friendDataAsset.RequestList)
                {
                    if(friendDataModel.id == this.friendDataModel.id)
                    {
                        friendDataAsset.RequestList.Remove(friendDataModel);
                        friendDataAsset.FriendList.Add(friendDataModel);
                        gameObject.SetActive(false);
                        return;
                    }
                }
            });
    }

    private void RefuseRequestFriend()
    {
        CustomHTTP.RefuseRequestFriend(userDataAsset.AccessToken, friendDataModel.id,
           (result) =>
           {
               foreach (var friendDataModel in friendDataAsset.RequestList)
               {
                   if (friendDataModel.id == this.friendDataModel.id)
                   {
                       friendDataAsset.RequestList.Remove(friendDataModel);
                       gameObject.SetActive(false);
                       return;
                   }
               }
           });
    }
}
