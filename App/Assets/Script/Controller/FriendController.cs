using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class FriendController : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;

    [Header("Friend")]
    [SerializeField] private Button friendBtn;
    [SerializeField] private GameObject friendObj;
    [SerializeField] private GameObject friendContentObj;
    [SerializeField] private GameObject friendItemObj;

    void Start()
    {
        friendBtn.onClick.AddListener(OpenFriend);
    }

    private void OnDestroy()
    {
        friendBtn.onClick.RemoveAllListeners();
    }

    private void OpenTap(GameObject tapObject)
    {
        friendObj.SetActive(false);
        tapObject.SetActive(true);
    }

    private void OpenFriend()
    {
        OpenTap(friendObj);

        if(userDataAsset.UserDataModel.)

        for(int i = 0)
    }
}
