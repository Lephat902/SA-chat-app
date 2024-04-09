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

    public void SetUp(HeaderConversationDataModel conversationDataModel)
    {
        var conversationFriend = CheckDirectChat(conversationDataModel.id);
        if (conversationFriend.id != null && conversationFriend.id != string.Empty)
        {
            StartCoroutine(LoadImage(conversationFriend.avatar));
            text.text = conversationFriend.username;
        }
        else
        {
            StartCoroutine(LoadImage(conversationDataModel.avatar));
            text.text = conversationDataModel.name;
        }


        this.conversationDataModel = conversationDataModel;

        button.onClick.RemoveAllListeners();
        button.onClick.AddListener(OpenChat);
    }

    private ConversationUserDataModel CheckDirectChat(string conversationId)
    {
        foreach (var conversationData in chatDataAsset.ConversationList)
        {
            if (conversationData.Key.id != conversationId)
                continue;

            var data = conversationData.Key.users;
            if (data.Count == 2)
                for (int j = 0; j < data.Count; j++)
                    if (data[j].id != userDataAsset.UserDataModel.id)
                        return data[j];
        }

        return default;
    }

    private void OpenChat()
    {
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
            imageActive.SetActive(true);
        else if (conversationDataModel.id != ChatController.CurConversationId && imageActive.activeInHierarchy)
            imageActive.SetActive(false);
    }
}

