using System;
using System.Collections.Generic;
using Cysharp.Threading.Tasks;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.UI;

partial class CustomSocket : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;

    private const string DOMAIN = "https://chatapp.tutorify.site";
    private static SocketIOUnity socket;
    private bool isConnecting;

    // Start is called before the first frame update
    public async UniTask StartConnect()
    {
        isConnecting = false;

        Debug.Log("Start connect to socket");
        var uri = new Uri(DOMAIN);
        socket = new SocketIOUnity(uri, new SocketIOOptions
        {
            Query = new Dictionary<string, string> { { "token", userDataAsset.AccessToken } },
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
        });
        socket.OnConnected += (sender, e) => { Debug.Log("Done connect to socket"); isConnecting = true; };
        socket.OnDisconnected += (sender, e) => { Debug.LogError("Disconnect to socket"); isConnecting = false; };
        socket.OnError += (sender, e) => { Debug.LogError("Error socket");};

        socket.Connect();

        StartFriend();
        StartChat();

        await UniTask.WaitUntil(() => isConnecting);
    }
}
