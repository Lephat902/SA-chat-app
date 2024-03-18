using System;
using UnityEngine;

[CreateAssetMenu(fileName = "UserDataAsset", menuName = "ScriptableObjects/UserDataAsset")]
class UserDataAsset: ScriptableObject
{
    public string dataFileName;
    private string accessToken;

    public string AccessToken
    {
        get { return accessToken; }
        set { accessToken = value;  }
    }
}

