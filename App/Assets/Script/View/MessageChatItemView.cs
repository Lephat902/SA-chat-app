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

    public async void SetUp(MessageConversationDataModel chatDataModel)
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
            myFakeTxt.gameObject.SetActive(false);
            otherFakeTxt.text = chatDataModel.text;
            otherRealxt.text = chatDataModel.text;
            otherFakeTxt.gameObject.SetActive(true);
        }

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
        
        Debug.LogError("chim " + mainRectTransform.sizeDelta + " == " + myFakeTransform.sizeDelta + " == " + new Vector2(myFakeTransform.rect.width, myFakeTransform.rect.height));
    }
}

