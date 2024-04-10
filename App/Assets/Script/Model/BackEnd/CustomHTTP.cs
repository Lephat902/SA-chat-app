using Cysharp.Threading.Tasks;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

public static partial class CustomHTTP
{
    public const string DOMAIN = "https://chatapp.tutorify.site";

    #region HttpClient
    /*private static async Task<HttpResponseMessage> POST(string url, object data)
    {
        using (var client = new HttpClient())
        {
            var jsonData = JsonUtility.ToJson(data);
            var respone = await client.PostAsync(url,
                new StringContent(jsonData, Encoding.UTF8, "application/json"));

            Debug.Log("POST to " + url + " data: " + jsonData);
            return respone;
        }
    }*/

    /*private static async Task<HttpResponseMessage> POST(string url, object data, string accessToken)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            var jsonData = JsonUtility.ToJson(data);
            var respone = await client.PostAsync(url,
                new StringContent(jsonData, Encoding.UTF8, "application/json"));

            Debug.Log("POST to " + url + " data: " + jsonData);
            return respone;
        }
    }*/

    /*private static async Task<HttpResponseMessage> GET(string url, string accessToken = null)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            var respone = await client.GetAsync(url);

            Debug.Log("GET from " + url);
            return respone;
        }
    }*/

    /*private static async Task<HttpResponseMessage> PUT(string url, string accessToken = null)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            var respone = await client.PutAsync(url, null);

            Debug.Log("PUT to " + url);
            return respone;
        }
    }*/
    #endregion

    #region UnityWebRequest

    public struct HTTPDataRespone
    {
        public bool isSuccess;
        public string message;

        public HTTPDataRespone(bool isSuccess, string message)
        {
            this.isSuccess = isSuccess;
            this.message = message;
        }
    }

    private static void AddDefaultHeader(UnityWebRequest request)
    {
        request.SetRequestHeader("Access-Control-Allow-Credentials", "true");
        request.SetRequestHeader("Access-Control-Expose-Headers", "Content-Length, Content-Encoding");
        request.SetRequestHeader("Access-Control-Allow-Headers", "Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time, Content-Type");
        request.SetRequestHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        request.SetRequestHeader("Access-Control-Allow-Origin", "*");
    }

    private static async Task<HTTPDataRespone> POST(string url, object data)
    {
        var jsonData = JsonUtility.ToJson(data);
        Debug.Log("POST to " + url + " data: " + jsonData);

        var request = new UnityWebRequest(url, "POST");
        AddDefaultHeader(request);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        
        try
        {
            await request.SendWebRequest();
            await UniTask.WaitUntil(() => request.isDone);
            if (request.result != UnityWebRequest.Result.Success)
                return (new HTTPDataRespone(false, request.downloadHandler.text));
            else
                return (new HTTPDataRespone(true, request.downloadHandler.text));
        }
        catch (Exception ex) { return (new HTTPDataRespone(false, request.downloadHandler.text)); }
    }

    private static async Task<HTTPDataRespone> POST(string url, object data, string accessToken)
    {
        var jsonData = JsonUtility.ToJson(data);
        Debug.Log("POST to " + url + " data: " + jsonData);

        var request = new UnityWebRequest(url, "POST");
        AddDefaultHeader(request);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        request.SetRequestHeader("Authorization", "Bearer " + accessToken);

        try
        {
            await request.SendWebRequest();
            await UniTask.WaitUntil(() => request.isDone);
            if (request.result != UnityWebRequest.Result.Success)
                return (new HTTPDataRespone(false, request.error));
            else
                return (new HTTPDataRespone(true, request.downloadHandler.text));
        }
        catch (Exception ex) { return (new HTTPDataRespone(false, request.downloadHandler.text)); }
    }

    private static async Task<HTTPDataRespone> GET(string url, string accessToken = null)
    {
        Debug.Log("Get from " + url);

        var request = new UnityWebRequest(url, "GET");
        AddDefaultHeader(request);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        if (accessToken != null)
            request.SetRequestHeader("Authorization", "Bearer " + accessToken);

        try
        {
            await request.SendWebRequest();
            await UniTask.WaitUntil(() => request.isDone);
            if (request.result != UnityWebRequest.Result.Success)
                return (new HTTPDataRespone(false, request.error));
            else
                return (new HTTPDataRespone(true, request.downloadHandler.text));
        }
        catch (Exception ex) { return (new HTTPDataRespone(false, request.downloadHandler.text)); }
    }

    private static async Task<HTTPDataRespone> PUT(string url, string accessToken = null)
    {
        Debug.Log("PUT to " + url);

        var request = new UnityWebRequest(url, "PUT");
        AddDefaultHeader(request);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        if (accessToken != null)
            request.SetRequestHeader("Authorization", "Bearer " + accessToken);

        try
        {
            await request.SendWebRequest();
            await UniTask.WaitUntil(() => request.isDone);
            if (request.result != UnityWebRequest.Result.Success)
                return (new HTTPDataRespone(false, request.downloadHandler.text));
            else
                return (new HTTPDataRespone(true, request.downloadHandler.text));
        }
        catch (Exception ex) { return (new HTTPDataRespone(false, request.downloadHandler.text)); }
    }

    #endregion
}
