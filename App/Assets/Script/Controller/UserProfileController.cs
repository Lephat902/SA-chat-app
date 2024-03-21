using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class UserProfileController : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;

    [Header("UI")]
    [SerializeField] private UserProfileView userProfileView;

    void Start()
    {
        userProfileView.SetUI(userDataAsset.UserDataModel.id, userDataAsset.UserDataModel.username, userDataAsset.UserDataModel.avatar);
    }
}
