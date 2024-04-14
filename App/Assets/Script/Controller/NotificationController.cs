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

    public static UnityEvent<string> OnNotiEvent = new();

    private void Start()
    {
        okBtn.onClick.AddListener(OffNoti);
        OnNotiEvent.AddListener(OnNoti);
    }

    private void OnDestroy()
    {
        okBtn.onClick.RemoveAllListeners();
        OnNotiEvent.RemoveAllListeners();
    }
    private void OffNoti()
    {
        canvasGroup.alpha = 0;
        canvasGroup.blocksRaycasts = false;
        canvasGroup.interactable = false;
    }

    private void OnNoti(string text)
    {
        contentTxt.text = text;
        canvasGroup.alpha = 1;
        canvasGroup.blocksRaycasts = true;
        canvasGroup.interactable = true;
    }
}
