using System;
using System.Collections.Generic;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.UI;

partial class CustomSocket : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;

    private const string DOMAIN = "https://chatapp.tutorify.site";
    private SocketIOUnity socket;

    // Start is called before the first frame update
    void Start()
    {
        var uri = new Uri(DOMAIN);
        socket = new SocketIOUnity(uri);
        socket.OnConnected += (sender, e) => Debug.Log("socket.OnConnected");

        socket.Connect();

        StartFriend();
    }
}
