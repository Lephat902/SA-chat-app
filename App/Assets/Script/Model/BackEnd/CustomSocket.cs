using System;
using Cysharp.Threading.Tasks;
using UnityEngine;
using NativeWebSocket;
using System.Collections.Generic;

partial class CustomSocket : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;

    private const string DOMAIN = "ws://chatapp.tutorify.site";
    private static WebSocket socket;
    private bool isConnecting;

    // Start is called before the first frame update
    public async UniTask StartConnect()
    {
        isConnecting = false;

        Debug.Log("Start connect to socket: " + DOMAIN);
        /*var uri = new Uri(DOMAIN);
        socket = new SocketIOUnity(uri, new SocketIOOptions
        {
            Query = new Dictionary<string, string> { { "token", userDataAsset.AccessToken } },
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
        });
        socket.OnConnected += (sender, e) => { Debug.Log("Done connect to socket"); isConnecting = true; };
        socket.OnDisconnected += (sender, e) => { Debug.LogError("Disconnect to socket"); isConnecting = false; };
        socket.OnError += (sender, e) => { Debug.LogError("Error socket");};

        socket.Connect();*/

        socket = new WebSocket(DOMAIN, new Dictionary<string, string> { { "token", userDataAsset.AccessToken } });
        socket.OnOpen += () => { Debug.Log("Done connect to socket"); isConnecting = true; };
        socket.OnClose += (e) => { Debug.LogError("Disconnect to socket: " + e); isConnecting = false; };
        socket.OnError += (e) => { Debug.LogError("Error of socket: " + e); isConnecting = false; };
        socket.OnMessage += (bytes) =>
        {
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            Debug.Log("Received OnMessage! (" + bytes.Length + " bytes) " + message);
            HandleMessage(message);
        };

        await socket.Connect();

        StartFriend();
        StartChat();

        await UniTask.WaitUntil(() => isConnecting);
    }

    private void Update()
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        if (socket != null)
            socket.DispatchMessageQueue();
#endif 
    }

    private void HandleMessage(string message)
    {

    }
}
