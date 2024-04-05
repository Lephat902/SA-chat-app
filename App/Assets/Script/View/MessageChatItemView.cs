using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

class MessageChatItemView : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private TextMeshProUGUI otherTxt;
    [SerializeField] private TextMeshProUGUI myTxt;

    public void SetUp(ChatDataModel chatDataModel)
    {
        if(chatDataModel.user == userDataAsset.UserDataModel.id)
        {
            otherTxt.gameObject.SetActive(false);
            myTxt.text = chatDataModel.conversation;
            myTxt.gameObject.SetActive(true);
        }
    }
}

