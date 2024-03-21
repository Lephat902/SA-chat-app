using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.Collections;
using UnityEngine;
using UnityEngine.UI;

public class FriendController : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private FriendDataAsset friendDataAsset;

    [Header("Friend")]
    [SerializeField] private Button friendOpenBtn;
    [SerializeField] private GameObject friendObj;
    [SerializeField] private Transform friendContentObj;
    [SerializeField] private FriendItemView friendItemObj;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriend = new();

    [Header("Search")]
    [SerializeField] private Button friendSearchOpenBtn;
    [SerializeField] private GameObject friendSearchObj;
    [SerializeField] private Button friendSearchBtn;
    [SerializeField] private TMP_InputField friendSearchInput;
    [SerializeField] private Transform friendSearchContentObj;
    [SerializeField] private FriendItemView friendSearchItemObj;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriendSearch = new();

    [Header("Request")]
    [SerializeField] private Button friendRequestOpenBtn;
    [SerializeField] private GameObject friendRequestObj;
    [SerializeField] private Transform friendRequestContentObj;
    [SerializeField] private FriendItemView friendRequestItemObj;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriendRequest = new();

    void Start()
    {
        OpenTap(friendObj);
        LoadDataFriend();

        friendOpenBtn.onClick.AddListener(OpenFriend);
        friendSearchOpenBtn.onClick.AddListener(OpenFriendSearch);
        friendRequestOpenBtn.onClick.AddListener(OpenFriendRequest);
        friendSearchBtn.onClick.AddListener(SearchFriend);
    }

    private void OnDestroy()
    {
        friendOpenBtn.onClick.RemoveAllListeners();
        friendSearchOpenBtn.onClick.RemoveAllListeners();
        friendRequestOpenBtn.onClick.RemoveAllListeners();
        friendSearchBtn.onClick.RemoveAllListeners();
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
                listFriend[i].SetUI(friendData);
                listFriend[i].gameObject.SetActive(true);
            }

            else
            {
                var newItem = Instantiate(friendItemObj, friendContentObj);
                newItem.SetUI(friendData);
                listFriend.Add(newItem);
            }
        }

        if (listFriend.Count > friendDataAsset.FriendList.Count)
            for (int i = friendDataAsset.FriendList.Count; i < listFriend.Count; i++)
                listFriend[i].gameObject.SetActive(false);
    }

    private void SetUISearch(List<FriendDataModel> res)
    {
        if (res == null)
            return;

        for (int i = 0; i < res.Count; i++)
        {
            var friendData = res[i];

            if (i < listFriendSearch.Count)
            {
                listFriendSearch[i].SetUI(friendData);
                listFriendSearch[i].gameObject.SetActive(true);
            }

            else
            {
                var newItem = Instantiate(friendSearchItemObj, friendSearchContentObj);
                newItem.SetUI(friendData);
                listFriendSearch.Add(newItem);
            }
        }

        if (listFriendSearch.Count > res.Count)
            for (int i = res.Count; i < listFriendSearch.Count; i++)
                listFriendSearch[i].gameObject.SetActive(false);
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
                listFriendRequest[i].SetUI(friendData);
                listFriendRequest[i].gameObject.SetActive(true);
            }

            else
            {
                var newItem = Instantiate(friendRequestItemObj, friendContentObj);
                newItem.SetUI(friendData);
                listFriendRequest.Add(newItem);
            }
        }

        if (listFriendRequest.Count > friendDataAsset.RequestList.Count)
            for (int i = friendDataAsset.RequestList.Count; i < listFriendRequest.Count; i++)
                listFriendRequest[i].gameObject.SetActive(false);
    }

    #endregion

    #region ActionButton

    private void OpenTap(GameObject tapObject)
    {
        friendObj.SetActive(false);
        friendSearchObj.SetActive(false);
        friendRequestObj.SetActive(false);

        tapObject.SetActive(true);
    }

    private void OpenFriend() => OpenTap(friendObj);

    private void OpenFriendSearch() => OpenTap(friendSearchObj);

    private void OpenFriendRequest() => OpenTap(friendRequestObj);

    #endregion

    #region ActionSearch
    private void SearchFriend()
    {
        CustomHTTP.SearchFriend(friendSearchInput.text,
            (res) => { SetUISearch(res); },
            (err) => { });
    }
    #endregion
}
