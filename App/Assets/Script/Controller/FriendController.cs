using System;
using System.Collections;
using System.Collections.Generic;
using Unity.Collections;
using UnityEngine;
using UnityEngine.UI;

public class FriendController : MonoBehaviour
{
    [SerializeField] private bool isTest;

    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private FriendDataAsset friendDataAsset;

    [Header("Friend")]
    [SerializeField] private Button friendBtn;
    [SerializeField] private GameObject friendObj;
    [SerializeField] private GameObject friendContentObj;
    [SerializeField] private GameObject friendItemObj;

    [Header("Friend")]
    [SerializeField] private Transform contentFriend;
    [SerializeField] private FriendItemView friendView;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriend = new();

    [Header("Request")]
    [SerializeField] private Transform contentFriendRequest;
    [SerializeField] private FriendItemView friendRequestView;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriendRequest = new();

    void Start()
    {
        LoadDataFriend();

        friendBtn.onClick.AddListener(OpenFriend);
    }

    private void OnDestroy()
    {
        friendBtn.onClick.RemoveAllListeners();
    }

    #region Load Data

    private void LoadDataFriend()
    {
        LoadFriend();
        LoadRequest();
    }

    private void LoadFriend()
    {
        CustomHTTP.GetFriend(userDataAsset.AccessToken,
            (res) =>
            {
                friendDataAsset.FriendList = res;

                if (isTest)
                {
                    var a = new FriendDataModel() { id = "chim", username = "chim", avatar = "https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg"};
                    friendDataAsset.FriendList = new();
                    for (int i = 0; i < 5; i++)
                        friendDataAsset.FriendList.Add(a);
                }

                SetUIFriend();
            },
            (err) => { });
    }

    private void LoadRequest()
    {
        CustomHTTP.GetRequestFriend(userDataAsset.AccessToken,
            (res) =>
            {
                friendDataAsset.RequestList = res;
                SetUIRequest();
            },
            (err) => { });
    }

    #endregion

    #region SetUI

    private void SetUIFriend()
    {
        if (friendDataAsset.FriendList == null)
            return;

        for (int i = 0; i < friendDataAsset.FriendList.Count; i++)
        {
            var friendData = friendDataAsset.FriendList[i];

            if (i < listFriend.Count)
            {
                listFriend[i].SetUI(friendData.id, friendData.username, friendData.avatar);
                listFriend[i].gameObject.SetActive(true);
            }

            else
            {
                var newItem = Instantiate(friendView, contentFriend);
                listFriend.Add(newItem);
            }
        }

        if (listFriend.Count > friendDataAsset.FriendList.Count)
            for (int i = friendDataAsset.FriendList.Count; i < listFriend.Count; i++)
                listFriend[i].gameObject.SetActive(false);
    }

    private void SetUIRequest()
    {
        if (friendDataAsset.RequestList == null)
            return;

        for (int i = 0; i < friendDataAsset.RequestList.Count; i++)
        {
            var friendData = friendDataAsset.RequestList[i];

            if (i < listFriendRequest.Count)
            {
                listFriendRequest[i].SetUI(friendData.id, friendData.username, friendData.avatar);
                listFriendRequest[i].gameObject.SetActive(true);
            }

            else
            {
                var newItem = Instantiate(friendRequestView, contentFriend);
                listFriendRequest.Add(newItem);
            }
        }

        if (listFriendRequest.Count > friendDataAsset.RequestList.Count)
            for (int i = friendDataAsset.RequestList.Count; i < listFriendRequest.Count; i++)
                listFriendRequest[i].gameObject.SetActive(false);
    }

    #endregion

    private void OpenTap(GameObject tapObject)
    {
        friendObj.SetActive(false);
        tapObject.SetActive(true);
    }

    private void OpenFriend()
    {
        OpenTap(friendObj);

        /*if(userDataAsset.UserDataModel.f)

        for(int i = 0)*/
    }
}
