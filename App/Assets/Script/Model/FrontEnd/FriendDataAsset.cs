using System;
using System.Collections.Generic;
using Unity.Collections;
using UnityEngine;

[CreateAssetMenu(fileName = "FriendDataAsset", menuName = "ScriptableObjects/FriendDataAsset")]
class FriendDataAsset : ScriptableObject
{
    [SerializeField] private List<FriendDataModel> friendList;
    [SerializeField] private List<FriendDataModel> requestList;

    public List<FriendDataModel> FriendList
    {
        get { return friendList; }
        set { friendList = value; }
    }

    public List<FriendDataModel> RequestList
    {
        get { return requestList; }
        set { requestList = value; }
    }
}

