using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using Unity.Collections;
using UnityEngine;

[CreateAssetMenu(fileName = "ChatDataAsset", menuName = "ScriptableObjects/ChatDataAsset")]
class ChatDataAsset : ScriptableObject
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private Dictionary<HeaderConversationDataModel, List<MessageConversationDataModel>> conversationList;

    public Dictionary<HeaderConversationDataModel, List<MessageConversationDataModel>> ConversationList => conversationList;

    public bool AddConversation(HeaderConversationDataModel conversationDataModel)
    {
        if (conversationList == null)
            conversationList = new();

        foreach (var conversationData in conversationList)
            if (conversationData.Key.id == conversationDataModel.id)
            {
                var messageData = conversationList[conversationData.Key];
                conversationList.Remove(conversationData.Key);
                conversationList.Add(conversationDataModel, messageData);
                return false;
            }


        conversationList.Add(conversationDataModel, new List<MessageConversationDataModel>());
        return true;
    }

    public bool AddMessage(string conversationId, MessageConversationDataModel chatDataModel)
    {
        if (conversationList == null)
            conversationList = new();

        foreach (var conversationData in conversationList)
            if (conversationData.Key.id == conversationId)
            {
                if (conversationData.Value.Count == 0)
                    CustomHTTP.GetMessageConversation(userDataAsset.AccessToken, conversationId,
                                                    (res) => { conversationList[conversationData.Key] = res; },
                                                    () => { Debug.LogError("Can't Load Conversation Message");});
                else
                    conversationData.Value.Add(chatDataModel);
                return true;
            }

        conversationList.Add(new HeaderConversationDataModel()
        {
            id = conversationId,
            createdAt = "chim",
            name = "chim",
            description = "chim",
            avatar = "chim",
            users = new List<ConversationUserDataModel>()
        }, new List<MessageConversationDataModel>() { chatDataModel }); ;
        return true;
    }

    public UniTask StartLoad()
    {
        conversationList = null;

        LoadConversation();

        return UniTask.WaitUntil(() => IsDoneLoad());
    }

    public bool IsDoneLoad() => conversationList != null;

    private void LoadConversation()
    {
        CustomHTTP.GetConversation(userDataAsset.AccessToken,
            async (res1) =>
            {
                var list = new Dictionary<HeaderConversationDataModel, List<MessageConversationDataModel>>();
                int wait = 0;
                if (res1 != null)
                {
                    wait = res1.Count;
                    for (int i = 0; i < res1.Count; i++)
                    {
                        CustomHTTP.GetHeaderConversation(userDataAsset.AccessToken,
                                                    res1[i].id,
                                                    (res2) => { list.Add(res2, new List<MessageConversationDataModel>()); wait--; },
                                                    () => { Debug.LogError("Can't Load Conversation Header"); wait--; });
                    }
                }

                await UniTask.WaitUntil(() => wait == 0);

                conversationList = list;
                Debug.Log("Done load chat data");
            },
            () => { Debug.LogError("Error Load All Conversations"); });
    }
}

