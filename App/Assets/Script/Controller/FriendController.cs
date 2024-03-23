using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using TMPro;
using Unity.Collections;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class FriendController : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private FriendDataAsset friendDataAsset;

    [Header("Friend")]
    [SerializeField] private Button friendOpenBtn;
    [SerializeField] private CanvasGroup friendCanvasGroup;
    [SerializeField] private Transform friendContentObj;
    [SerializeField] private FriendItemView friendItemObj;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriend = new();

    [Header("Search")]
    [SerializeField] private Button friendSearchOpenBtn;
    [SerializeField] private CanvasGroup friendSearchCanvasGroup;
    [SerializeField] private Button friendSearchBtn;
    [SerializeField] private TMP_InputField friendSearchInput;
    [SerializeField] private Transform friendSearchContentObj;
    [SerializeField] private FriendItemView friendSearchItemObj;
    [ReadOnly] [SerializeField] private List<FriendItemView> listFriendSearch = new();

    [Header("Request")]
    [SerializeField] private Button friendRequestOpenBtn;
    [SerializeField] private CanvasGroup friendRequestCanvasGroup;
    [SerializeField] private Transform friendRequestContentObj;
    [SerializeField] private RequestFriendItemView friendRequestItemObj;
    [ReadOnly] [SerializeField] private List<RequestFriendItemView> listFriendRequest = new();

    public static UnityEvent<string> OnAcceptRequest = new();
    public static UnityEvent<string> OnRefuseRequest = new();
    public static UnityEvent<string> OnIsAddedRequest = new();
    public static UnityEvent<string> OnIsAcceptedRequest = new();
    public static UnityEvent<string> OnIsRefusedRequest = new();

    void Start()
    {
        OnAcceptRequest.AddListener(AcceptRequest);
        OnRefuseRequest.AddListener(RefuseRequest);
        OnIsAddedRequest.AddListener(IsAddedRequest);
        OnIsAcceptedRequest.AddListener(IsAcceptedRequest);
        OnIsRefusedRequest.AddListener(IsRefusedRequest);

        OpenTap(friendCanvasGroup);
        SetUIFriend();
        SetUIRequest();

        friendOpenBtn.onClick.AddListener(OpenFriend);
        friendSearchOpenBtn.onClick.AddListener(OpenFriendSearch);
        friendRequestOpenBtn.onClick.AddListener(OpenFriendRequest);
        friendSearchBtn.onClick.AddListener(SearchFriend);
    }

    private void OnDestroy()
    {
        OnAcceptRequest.RemoveAllListeners();
        OnRefuseRequest.RemoveAllListeners();
        OnIsAddedRequest.RemoveAllListeners();
        OnIsAcceptedRequest.RemoveAllListeners();
        OnIsRefusedRequest.RemoveAllListeners();

        friendOpenBtn.onClick.RemoveAllListeners();
        friendSearchOpenBtn.onClick.RemoveAllListeners();
        friendRequestOpenBtn.onClick.RemoveAllListeners();
        friendSearchBtn.onClick.RemoveAllListeners();
    }

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
            var requestData = friendDataAsset.RequestList[i];

            if (i < listFriendRequest.Count)
            {
                listFriendRequest[i].SetUI(requestData.requester);
                listFriendRequest[i].gameObject.SetActive(true);
            }

            else
            {
                var newItem = Instantiate(friendRequestItemObj, friendRequestContentObj);
                newItem.SetUI(requestData.requester);
                newItem.SetID(requestData.id);
                listFriendRequest.Add(newItem);
            }
        }

        if (listFriendRequest.Count > friendDataAsset.RequestList.Count)
            for (int i = friendDataAsset.RequestList.Count; i < listFriendRequest.Count; i++)
                listFriendRequest[i].gameObject.SetActive(false);
    }

    #endregion

    #region ActionButton

    private void OpenTap(CanvasGroup tapObject)
    {
        friendCanvasGroup.alpha = 0;
        friendCanvasGroup.interactable = false;
        friendCanvasGroup.blocksRaycasts = false;

        friendSearchCanvasGroup.alpha = 0;
        friendSearchCanvasGroup.interactable = false;
        friendSearchCanvasGroup.blocksRaycasts = false;

        friendRequestCanvasGroup.alpha = 0;
        friendRequestCanvasGroup.interactable = false;
        friendRequestCanvasGroup.blocksRaycasts = false;

        tapObject.alpha = 1;
        tapObject.interactable = true;
        tapObject.blocksRaycasts = true;
    }

    private void OpenFriend() => OpenTap(friendCanvasGroup);

    private void OpenFriendSearch() => OpenTap(friendSearchCanvasGroup);

    private void OpenFriendRequest() => OpenTap(friendRequestCanvasGroup);

    #endregion

    #region ActionSearch
    private void SearchFriend()
    {
        CustomHTTP.SearchFriend(friendSearchInput.text,
            (res) => { SetUISearch(res); },
            (err) => { });
    }
    #endregion

    #region ActionStatic
    private void AcceptRequest(string id)
    {
        foreach (var requestDataModel in friendDataAsset.RequestList)
        {
            if (requestDataModel.id == id)
            {
                friendDataAsset.RequestList.Remove(requestDataModel);
                friendDataAsset.FriendList.Add(requestDataModel.requester);
                SetUIRequest();
                SetUIFriend();
                return;
            }
        }
    }

    private void RefuseRequest(string id)
    {
        foreach (var friendDataModel in friendDataAsset.RequestList)
        {
            if (friendDataModel.id == id)
            {
                friendDataAsset.RequestList.Remove(friendDataModel);
                SetUIRequest();
                return;
            }
        }
    }

    private void IsAddedRequest(string id)
    {
        foreach (var friendDataModel in friendDataAsset.RequestList)
            if (friendDataModel.id == id)
                return;

        CustomHTTP.GetProfileByID(id,
            (res) =>
            {
                var friendDataModel = new FriendDataModel
                {
                    id = res.id,
                    username = res.username,
                    avatar = res.avatar
                };

                friendDataAsset.RequestList.Add(new RequestDataModel() { id = id, requester = friendDataModel });
                SetUIRequest();
            },
            (err) => { });
    }

    private void IsAcceptedRequest(string id)
    {
        foreach (var friendDataModel in friendDataAsset.FriendList)
            if (friendDataModel.id == id)
                return;

        CustomHTTP.GetProfileByID(id,
            (res) =>
            {
                var friendDataModel = new FriendDataModel
                {
                    id = res.id,
                    username = res.username,
                    avatar = res.avatar
                };

                friendDataAsset.FriendList.Add(friendDataModel);
                SetUIFriend();
            },
            (err) => { });
    }

    private void IsRefusedRequest(string id) { }

    #endregion
}
