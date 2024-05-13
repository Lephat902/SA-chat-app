using System;
using Unity.Collections;
using UnityEngine;

[CreateAssetMenu(fileName = "UserDataAsset", menuName = "ScriptableObjects/UserDataAsset")]
class UserDataAsset : ScriptableObject
{
    [ReadOnly] [SerializeField] private string accessToken;
    [ReadOnly] [SerializeField] private UserDataModel userDataModel;

    public string AccessToken
    {
        get { return accessToken; }
        set { accessToken = value; }
    }

    public UserDataModel UserDataModel
    {
        get { return userDataModel; }
        set { userDataModel = value; }
    }
}

