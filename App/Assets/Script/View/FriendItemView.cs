using Cysharp.Threading.Tasks;
using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class FriendItemView : MonoBehaviour
{
    [SerializeField] protected TextMeshProUGUI userID;
    [SerializeField] protected TextMeshProUGUI userName;
    [SerializeField] protected Image userAvatar;
    [SerializeField] protected Sprite defaultSpite;
    [SerializeField] protected Button copyIdBtn;

    protected FriendDataModel friendDataModel;

    public virtual void SetUI(FriendDataModel friendDataModel)
    {
        userID.text = friendDataModel.id;
        userName.text = friendDataModel.username;
        StartCoroutine(LoadImage(friendDataModel.avatar));
        this.friendDataModel = friendDataModel;

        copyIdBtn.onClick.RemoveAllListeners();
        copyIdBtn.onClick.AddListener(CopyId);
    }

    private void CopyId()
    {
        GUIUtility.systemCopyBuffer = friendDataModel.id;
        NotificationController.OnCopy.Invoke(friendDataModel.id);
    }

    private IEnumerator LoadImage(string avatarUrl)
    {
        var www = new WWW(avatarUrl);
        yield return www;

        if (www.texture != null)
            userAvatar.sprite = Sprite.Create(www.texture, new Rect(0, 0, www.texture.width, www.texture.height), new Vector2(0, 0));

        else
            userAvatar.sprite = defaultSpite;
    }
}
