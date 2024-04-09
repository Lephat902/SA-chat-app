using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using TMPro;
using Unity.Collections;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class ChatController : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private ChatDataAsset chatDataAsset;

    [Header("Chat")]
    [SerializeField] private Button chatOpenBtn;
    [SerializeField] private CanvasGroup chatCanvasGroup;
    [SerializeField] private Transform chatAvatarContentObj;
    [SerializeField] private Transform chatConversationContentObj;
    [SerializeField] private MessageAvatarItemView messageAvatarItemObj;
    [SerializeField] private MessageChatItemView messageChatItemObj;
    [ReadOnly] [SerializeField] private List<MessageAvatarItemView> listAvatar = new();
    [ReadOnly] [SerializeField] private List<MessageChatItemView> listChat = new();
    private static string curConversationId;
    private int curConversationIndex;
    [SerializeField] private GameObject sendMessageObj;
    [SerializeField] private Button messageSendBtn;
    [SerializeField] private TMP_InputField messageSendInput;
    private bool isOn;

    public static string CurConversationId => curConversationId;

    public static UnityEvent<HeaderConversationDataModel> OnConversationCreate = new();
    public static UnityEvent<string, MessageConversationDataModel> OnChatMessageRecieve = new();
    public static UnityEvent<string> OnConversationOpen = new();

    void Start()
    {
        SetUIAvatar();

        isOn = true;
        OnOff();

        OnConversationCreate.AddListener(ConversationCreate);
        OnChatMessageRecieve.AddListener(ChatMessageReceive);
        OnConversationOpen.AddListener(OpenChat);

        chatOpenBtn.onClick.AddListener(OnOff);
        messageSendBtn.onClick.AddListener(SendMessage);
    }

    private void OnDestroy()
    {
        OnConversationCreate.RemoveAllListeners();
        OnChatMessageRecieve.RemoveAllListeners();
        OnConversationOpen.RemoveAllListeners();

        chatOpenBtn.onClick.RemoveAllListeners();
        messageSendBtn.onClick.RemoveAllListeners();
    }

    #region SetUI

    private void SetUIAvatar()
    {
        if (chatDataAsset.ConversationList == null)
            return;

        var i = 0;
        foreach (var conversationData in chatDataAsset.ConversationList)
        {
            var conversationDataModel = conversationData.Key;

            if (i < listAvatar.Count)
            {
                listAvatar[i].gameObject.SetActive(true);
                listAvatar[i].SetUp(conversationDataModel);
            }

            else
            {
                var newItem = Instantiate(messageAvatarItemObj, chatAvatarContentObj);
                newItem.SetUp(conversationDataModel);
                listAvatar.Add(newItem);
            }

            i++;
        }

        if (listAvatar.Count > chatDataAsset.ConversationList.Count)
            for (int j = chatDataAsset.ConversationList.Count; j < listAvatar.Count; j++)
                listAvatar[j].gameObject.SetActive(false);
    }

    private async void SetUIChat(string conversationId)
    {
        if (chatDataAsset.ConversationList == null)
            return;

        List<MessageConversationDataModel> chatDataModels = null;
        foreach (var conversationData in chatDataAsset.ConversationList)
            if (conversationData.Key.id == conversationId)
                chatDataModels = conversationData.Value;

        if (chatDataModels == null)
            chatDataModels = new();

        chatConversationContentObj.gameObject.SetActive(false);

        curConversationId = conversationId;

        for (int i = 0; i < chatDataModels.Count; i++)
        {
            var chatDataModel = chatDataModels[i];

            if (i < listChat.Count)
            {
                listChat[i].gameObject.SetActive(true);
                listChat[i].SetUp(chatDataModel);
            }

            else
            {
                var newItem = Instantiate(messageChatItemObj, chatConversationContentObj);
                newItem.SetUp(chatDataModel);
                listChat.Add(newItem);
            }
        }

        curConversationIndex = chatDataModels.Count - 1;

        if (listChat.Count > chatDataModels.Count)
            for (int i = chatDataModels.Count; i < listChat.Count; i++)
                listChat[i].gameObject.SetActive(false);

        await UniTask.DelayFrame(5);
        chatConversationContentObj.gameObject.SetActive(true);
    }

    private void AddUIChat(string conversationId, MessageConversationDataModel chatDataModel)
    {
        if (conversationId != curConversationId)
            return;

        if (chatDataAsset.ConversationList == null)
            return;

        List<MessageConversationDataModel> chatDataModels = null;
        foreach (var conversationData in chatDataAsset.ConversationList)
            if (conversationData.Key.id == conversationId)
                chatDataModels = conversationData.Value;

        if (chatDataModels == null)
            return;

        if (curConversationIndex < listChat.Count - 1)
        {
            listChat[curConversationIndex + 1].gameObject.SetActive(true);
            listChat[curConversationIndex + 1].SetUp(chatDataModel);
        }

        else
        {
            var newItem = Instantiate(messageChatItemObj, chatConversationContentObj);
            newItem.SetUp(chatDataModel);
            listChat.Add(newItem);
            curConversationIndex = listChat.Count - 1;
        }
    }

    #endregion

    #region ActionButton

    private void OnOff()
    {
        if (isOn)
        {
            isOn = false;
            chatCanvasGroup.alpha = 0;
            chatCanvasGroup.interactable = false;
            chatCanvasGroup.blocksRaycasts = false;
        }
        else
        {
            isOn = true;
            chatCanvasGroup.alpha = 1;
            chatCanvasGroup.interactable = true;
            chatCanvasGroup.blocksRaycasts = true;
        }
    }

    private void SendMessage()
    {
        if (curConversationId == string.Empty)
            return;

        CustomSocket.SendChatMessage(curConversationId, messageSendInput.text);

        messageSendInput.text = "";
    }

    #endregion

    #region ActionStatic

    private void OpenChat(string conversationId)
    {
        if (!isOn)
            OnOff();

        chatDataAsset.CheckAndLoadMessage(conversationId, () => SetUIChat(conversationId));

        if (curConversationId != string.Empty && !sendMessageObj.activeInHierarchy)
            sendMessageObj.SetActive(true);
    }

    private void ConversationCreate(HeaderConversationDataModel conversationDataModel)
    {
        chatDataAsset.AddConversation(conversationDataModel, () => SetUIAvatar());
    }

    private void ChatMessageReceive(string conversationId, MessageConversationDataModel chatDataModel)
    {
        chatDataAsset.AddMessage(conversationId, chatDataModel, () => AddUIChat(conversationId, chatDataModel));

    }

    #endregion
}
