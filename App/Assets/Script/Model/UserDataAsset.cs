using System;
using Unity.Collections;
using UnityEngine;

[CreateAssetMenu(fileName = "UserDataAsset", menuName = "ScriptableObjects/UserDataAsset")]
class UserDataAsset : ScriptableObject
{
    [ReadOnly] [SerializeField] private string accessToken;

    public string AccessToken
    {
        get { return accessToken; }
        set { accessToken = value; }
    }
}

