using System;
using Cysharp.Threading.Tasks;
using UnityEngine;
using NativeWebSocket;
using System.Collections.Generic;
using UnityEngine.Events;

partial class CustomSocket : MonoBehaviour
{
    [SerializeField] private UserDataAsset userDataAsset;

    private const string DOMAIN = "wss://sa-chat-app-jjav6azlxq-as.a.run.app";
    private static WebSocket socket;

    public static UnityEvent<string> connectSocketEvent = new();
    private static UnityEvent<WebSocket> createSocketEvent = new();

    private void Start()
    {
        createSocketEvent.AddListener(StartFriend);
        createSocketEvent.AddListener(StartChat);
        connectSocketEvent.AddListener(StartConnect);
    }

    private void OnDestroy()
    {
        createSocketEvent.RemoveAllListeners();
        createSocketEvent.RemoveAllListeners();
        connectSocketEvent.RemoveAllListeners();
    }

    // Start is called before the first frame update
    private async void StartConnect(string accessToken)
    {
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

        socket = new WebSocket(DOMAIN + string.Format("?token={0}", accessToken));//, new Dictionary<string, string> { { "token", userDataAsset.AccessToken } });
        socket.OnOpen += () => { Debug.Log("Done connect to socket"); };
        socket.OnClose += (e) =>
        {
            Debug.LogError("Disconnect to socket: " + e);
            NotificationController.OnNotiEvent.Invoke("You have disconnected with web socket!");
        };
        socket.OnError += (e) => { Debug.LogError("Error of socket: " + e); };

        socket.Connect();

        createSocketEvent.Invoke(socket);

        await UniTask.WaitUntil(() => socket.State == WebSocketState.Connecting);
    }

    private void Update()
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        if (socket != null)
            socket.DispatchMessageQueue();
#endif 
    }

    public static bool IsConnecting => socket.State == WebSocketState.Connecting;
}
