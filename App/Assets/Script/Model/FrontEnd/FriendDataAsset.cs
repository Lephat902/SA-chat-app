using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using Unity.Collections;
using UnityEngine;

[CreateAssetMenu(fileName = "FriendDataAsset", menuName = "ScriptableObjects/FriendDataAsset")]
class FriendDataAsset : ScriptableObject
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private List<FriendDataModel> friendList;
    [SerializeField] private List<RequestDataModel> requestList;

    public List<FriendDataModel> FriendList
    {
        get { return friendList; }
        set { friendList = value; }
    }

    public List<RequestDataModel> RequestList
    {
        get { return requestList; }
        set { requestList = value; }
    }

    public UniTask StartLoad()
    {
        friendList = null;
        requestList = null;

        LoadFriend();
        LoadRequest();

        return UniTask.WaitUntil(() => IsDoneLoad());
    }

    public bool IsDoneLoad() => friendList != null && requestList != null;

    private void LoadFriend()
    {
        CustomHTTP.GetFriend(userDataAsset.AccessToken,
            (res) => { friendList = res; },
            (err) => { Debug.LogError("Error Load Friend"); });
    }

    private void LoadRequest()
    {
        CustomHTTP.GetRequestFriend(userDataAsset.AccessToken,
            (res) => { requestList = res; },
            (err) => { Debug.LogError("Error Load Friend Request"); });
    }
}

