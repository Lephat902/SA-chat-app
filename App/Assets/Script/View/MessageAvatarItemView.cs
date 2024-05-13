using Cysharp.Threading.Tasks;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

class MessageAvatarItemView : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private ChatDataAsset chatDataAsset;
    [SerializeField] private Image image;
    [SerializeField] private TextMeshProUGUI text;
    [SerializeField] private GameObject imageActive;
    [SerializeField] private Button button;
    [SerializeField] private Sprite defaultSpite;
    private HeaderConversationDataModel conversationDataModel;

    [Header("Fx")]
    [SerializeField] private GameObject fxOnClick;
    [SerializeField] private GameObject fxOnEnable;

    public void SetUp(HeaderConversationDataModel conversationDataModel)
    {
        if (conversationDataModel.name != null 
            && conversationDataModel.name != string.Empty
            && conversationDataModel.name.Length > 0)
        {
            StartCoroutine(LoadImage(conversationDataModel.avatar));
            text.text = conversationDataModel.name;
        }
        else
        {
            var users = conversationDataModel.users;
            for(int i = 0; i < users.Count; i++)
            {
                if (users[i].id == userDataAsset.UserDataModel.id)
                    continue;

                StartCoroutine(LoadImage(users[i].avatar));
                text.text = users[i].username;
                break;
            }
        }

        this.conversationDataModel = conversationDataModel;

        button.onClick.RemoveAllListeners();
        button.onClick.AddListener(OpenChat);
    }

    private async void OpenChat()
    {
        if (!fxOnClick.activeInHierarchy)
            fxOnClick.SetActive(true);
        else
        {
            fxOnClick.SetActive(false);
            await UniTask.DelayFrame(1);
            fxOnClick.SetActive(true);
        }

        ChatController.OnConversationOpen.Invoke(conversationDataModel.id);
    }

    private IEnumerator LoadImage(string avatarUrl)
    {
        var www = new WWW(avatarUrl);
        yield return www;

        if (www.texture != null)
            image.sprite = Sprite.Create(www.texture, new Rect(0, 0, www.texture.width, www.texture.height), new Vector2(0, 0));

        else
            image.sprite = defaultSpite;
    }

    private void Update()
    {
        if (conversationDataModel.id == ChatController.CurConversationId && !imageActive.activeInHierarchy)
        {
            imageActive.SetActive(true);
            fxOnEnable.SetActive(true);
        }

        else if (conversationDataModel.id != ChatController.CurConversationId && imageActive.activeInHierarchy)
        {
            imageActive.SetActive(false);
            fxOnEnable.SetActive(false);
        }
    }
}

