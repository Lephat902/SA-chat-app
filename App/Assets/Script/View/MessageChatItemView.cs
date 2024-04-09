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
    [SerializeField] private float maxSize = 800f;
    [SerializeField] private RectTransform otherFakeTransform;
    [SerializeField] private ContentSizeFitter otherFakeContentSize;
    [SerializeField] private RectTransform myFakeTransform;
    [SerializeField] private ContentSizeFitter myFakeContentSize;

    public void SetUp(MessageConversationDataModel chatDataModel)
    {
        otherFakeContentSize.horizontalFit = ContentSizeFitter.FitMode.PreferredSize;
        myFakeContentSize.horizontalFit = ContentSizeFitter.FitMode.PreferredSize;

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

        SetLayout(otherFakeTransform, otherFakeContentSize);
        SetLayout(myFakeTransform, myFakeContentSize);
    }

    private void SetLayout(RectTransform rectTransform, ContentSizeFitter contentSizeFitter)
    {
        if (rectTransform.rect.width >= maxSize)
        {
            contentSizeFitter.horizontalFit = ContentSizeFitter.FitMode.Unconstrained;
            rectTransform.sizeDelta = new Vector2(800, otherFakeTransform.sizeDelta.y);
        }
    }
}

