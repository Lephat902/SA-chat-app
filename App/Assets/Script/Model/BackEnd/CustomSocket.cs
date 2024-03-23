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
    public void StartConnect()
    {
        Debug.Log("Start connect to socket");
        var uri = new Uri(DOMAIN);
        socket = new SocketIOUnity(uri, new SocketIOOptions
        {
            Query = new Dictionary<string, string>{{"token", userDataAsset.AccessToken } },
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
        });
        socket.OnConnected += (sender, e) => Debug.Log("Done connect to socket");

        socket.Connect();

        StartFriend();
    }
}
