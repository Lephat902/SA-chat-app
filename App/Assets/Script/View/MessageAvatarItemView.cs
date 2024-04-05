using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

class MessageAvatarItemView : MonoBehaviour
{
    [SerializeField] private FriendDataAsset friendDataAsset;
    [SerializeField] private Image image;
    [SerializeField] private GameObject imageActive;
    [SerializeField] private Button button;
    [SerializeField] private Sprite defaultSpite;
    private ConversationDataModel conversationDataModel;

    public void SetUp(ConversationDataModel conversationDataModel)
    {
        for (int i = 0; i < friendDataAsset.FriendList.Count; i++)
            if (conversationDataModel.users.Contains(friendDataAsset.FriendList[i].id))
            {
                StartCoroutine(LoadImage(friendDataAsset.FriendList[i].avatar));
                break;
            }

        this.conversationDataModel = conversationDataModel;

        button.onClick.RemoveAllListeners();
        button.onClick.AddListener(OpenChat);
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
        else if(conversationDataModel.id != ChatController.CurConversationId && imageActive.activeInHierarchy)
            imageActive.SetActive(false);
    }
}

