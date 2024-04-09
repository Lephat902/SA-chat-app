using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

class MessageChatItemView : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private TextMeshProUGUI otherFakeTxt;
    [SerializeField] private TextMeshProUGUI otherRealxt;
    [SerializeField] private TextMeshProUGUI myFakeTxt;
    [SerializeField] private TextMeshProUGUI myRealTxt;

    public void SetUp(MessageConversationDataModel chatDataModel)
    {
        if(chatDataModel.userId == userDataAsset.UserDataModel.id)
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
    }
}

