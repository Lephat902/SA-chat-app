using Cysharp.Threading.Tasks;
using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

class MessageChatItemView : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private TextMeshProUGUI otherFakeTxt;
    [SerializeField] private TextMeshProUGUI otherRealxt;
    [SerializeField] private TextMeshProUGUI myFakeTxt;
    [SerializeField] private TextMeshProUGUI myRealTxt;

    [Header("Layout")]
    [SerializeField] private RectTransform mainRectTransform;
    [SerializeField] private RectTransform otherFakeTransform;
    [SerializeField] private ContentSizeFitter otherFakeContentSize;
    [SerializeField] private RectTransform myFakeTransform;
    [SerializeField] private ContentSizeFitter myFakeContentSize;

    private const string chatIdFormat = "<color=red>{0}</color>";

    public async void SetUp(MessageConversationDataModel chatDataModel, HeaderConversationDataModel headerConversationDataModel)
    {
        if (chatDataModel.userId == userDataAsset.UserDataModel.id)
        {
            otherFakeTxt.gameObject.SetActive(false);
            myFakeTxt.text = chatDataModel.text;
            myRealTxt.text = chatDataModel.text;
            myFakeTxt.gameObject.SetActive(true);
        }
        else
        {
            for (int i = 0; i < headerConversationDataModel.users.Count; i++)
            {
                if (headerConversationDataModel.users[i].id == chatDataModel.userId)
                {
                    myFakeTxt.gameObject.SetActive(false);
                    otherFakeTxt.text = string.Format(chatIdFormat, headerConversationDataModel.users[i].username) + " \n" + chatDataModel.text;
                    otherRealxt.text = string.Format(chatIdFormat, headerConversationDataModel.users[i].username) + " \n" + chatDataModel.text;
                    otherFakeTxt.gameObject.SetActive(true);
                    break;
                }
            }
        }

        otherFakeContentSize.SetLayoutVertical();
        myFakeContentSize.SetLayoutVertical();
        await UniTask.DelayFrame(20);

        SetMainLayOut(chatDataModel);
    }


    private void SetMainLayOut(MessageConversationDataModel chatDataModel)
    {
        if (chatDataModel.userId == userDataAsset.UserDataModel.id)
            mainRectTransform.sizeDelta = new Vector2(myFakeTransform.rect.width, myFakeTransform.rect.height);
        else
            mainRectTransform.sizeDelta = new Vector2(otherFakeTransform.rect.width, otherFakeTransform.rect.height);
    }
}

