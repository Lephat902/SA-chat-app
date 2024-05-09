using Cysharp.Threading.Tasks;
using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class NotificationController : MonoBehaviour
{
    [SerializeField] private CanvasGroup canvasGroup;
    [SerializeField] private TextMeshProUGUI contentTxt;
    [SerializeField] private Button okBtn;

    [Header("Friend")]
    [SerializeField] private GameObject fxNewFriend;
    [SerializeField] private GameObject fxNewFriendRequest;

    [Header("Copy")]
    [SerializeField] private GameObject fxCopy;
    [SerializeField] private TextMeshProUGUI copyTxt;

    public static UnityEvent<string> OnNotiEvent = new();
    public static UnityEvent OnNotiNewFriend = new();
    public static UnityEvent OnNotiNewFriendRequest = new();
    public static UnityEvent<string> OnCopy = new();

    private void Start()
    {
        okBtn.onClick.AddListener(OffNoti);
        OnNotiEvent.AddListener(OnNoti);
        OnNotiNewFriend.AddListener(OnNewFriend);
        OnNotiNewFriendRequest.AddListener(OnNewFriendRequest);
        OnCopy.AddListener(OnCopyString);
    }

    private void OnDestroy()
    {
        okBtn.onClick.RemoveAllListeners();
        OnNotiEvent.RemoveAllListeners();
        OnNotiNewFriend.RemoveAllListeners();
        OnNotiNewFriendRequest.RemoveAllListeners();
        OnCopy.RemoveAllListeners();
    }
    private void OffNoti()
    {
        canvasGroup.alpha = 0;
        canvasGroup.blocksRaycasts = false;
        canvasGroup.interactable = false;
        Application.Quit();
    }

    private void OnNoti(string text)
    {
        contentTxt.text = text;
        canvasGroup.alpha = 1;
        canvasGroup.blocksRaycasts = true;
        canvasGroup.interactable = true;
    }

    private async void OnNewFriend()
    {
        if (!fxNewFriend.activeInHierarchy)
            fxNewFriend.SetActive(true);
        else
        {
            fxNewFriend.SetActive(false);
            await UniTask.DelayFrame(1);
            fxNewFriend.SetActive(true);
        }
    }

    private async void OnNewFriendRequest()
    {
        if (!fxNewFriendRequest.activeInHierarchy)
            fxNewFriendRequest.SetActive(true);
        else
        {
            fxNewFriendRequest.SetActive(false);
            await UniTask.DelayFrame(1);
            fxNewFriendRequest.SetActive(true);
        }
    }

    private async void OnCopyString(string txt)
    {
        if (!fxCopy.activeInHierarchy)
            fxCopy.SetActive(true);
        else
        {
            fxCopy.SetActive(false);
            await UniTask.DelayFrame(1);
            fxCopy.SetActive(true);
        }

        copyTxt.text = "Copied: " + txt;
    }
}
