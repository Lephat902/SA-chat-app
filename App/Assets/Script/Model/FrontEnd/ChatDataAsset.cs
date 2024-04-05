﻿using Cysharp.Threading.Tasks;
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
            (res) => { conversationList = res; },
            () => { Debug.LogError("Error Load Conversation"); });
    }
}

