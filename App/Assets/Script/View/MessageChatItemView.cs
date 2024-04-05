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

    public void SetUp(ChatDataModel chatDataModel)
    {
        if(chatDataModel.user == userDataAsset.UserDataModel.id)
        {
            otherFakeTxt.gameObject.SetActive(false);
            myFakeTxt.text = chatDataModel.conversation;
            myRealTxt.text = chatDataModel.conversation;
            myFakeTxt.gameObject.SetActive(true);
        }
        else
        {
            myFakeTxt.gameObject.SetActive(false);
            otherFakeTxt.text = chatDataModel.conversation;
            otherRealxt.text = chatDataModel.conversation;
            otherFakeTxt.gameObject.SetActive(true);
        }
    }
}

