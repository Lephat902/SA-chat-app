using Cysharp.Threading.Tasks;
using System;
using System.Collections.Generic;
using Unity.Collections;
using UnityEngine;

[CreateAssetMenu(fileName = "ChatDataAsset", menuName = "ScriptableObjects/ChatDataAsset")]
class ChatDataAsset : ScriptableObject
{
    [SerializeField] private UserDataAsset userDataAsset;
    [SerializeField] private List<ConversationDataModel> conversationList;

    public List<ConversationDataModel> ConversationList
    {
        get { return conversationList; }
        //set { conversationList = value; }
    }

    public bool AddConversation(ConversationDataModel conversationDataModel)
    {
        if (conversationList == null)
            conversationList = new();

        for (int i = 0; i < conversationList.Count; i++)
            if (conversationList[i].id == conversationDataModel.id)
                return false;

        conversationList.Add(conversationDataModel);
        return true;
    }

    public bool AddMessage(string conversationId, ChatDataModel chatDataModel)
    {
        if (conversationList == null)
            conversationList = new();

        for (int i = 0; i < conversationList.Count; i++)
            if (conversationList[i].id == conversationId)
            {
                conversationList[i].userConversations.Add(chatDataModel);
                return true;
            }

        conversationList.Add(new ConversationDataModel()
        {
            id = conversationId,
            users = new(),
            messages = new(),
            userConversations = new() { chatDataModel }
        });
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
                var list = new List<ConversationDataModel>();
                int wait = 0;
                if (res1 != null)
                {
                    wait = res1.Count;
                    for (int i = 0; i < res1.Count; i++)
                    {
                        CustomHTTP.GetConversation(userDataAsset.AccessToken,
                                                    res1[i].id,
                                                    (res2) => { list.Add(res2); wait--; },
                                                    () => { Debug.LogError("Can't Load Conversation"); wait--; });
                    }
                }

                await UniTask.WaitUntil(() => wait == 0);

                conversationList = list;
            },
            () => { Debug.LogError("Error Load All Conversations"); });
    }
}

