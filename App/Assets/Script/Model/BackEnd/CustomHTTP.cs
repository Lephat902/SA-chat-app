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

    private static async Task<HttpResponseMessage> POST(string url, object data)
    {
        using (var client = new HttpClient())
        {
            var jsonData = JsonUtility.ToJson(data);
            var respone = await client.PostAsync(url,
                new StringContent(jsonData, Encoding.UTF8, "application/json"));

            Debug.Log("POST to " + url + " data: " + jsonData);
            return respone;
        }
    }

    private static async Task<HttpResponseMessage> POST(string url, object data, string accessToken)
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
    }

    private static async Task<HttpResponseMessage> GET(string url, string accessToken = null)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            var respone = await client.GetAsync(url);

            Debug.Log("GET from " + url);
            return respone;
        }
    }

    private static async Task<HttpResponseMessage> PUT(string url, string accessToken = null)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            var respone = await client.PutAsync(url, null);

            Debug.Log("PUT to " + url);
            return respone;
        }
    }

    #region WEBGL
    private static async Task<Tuple<bool, string>> POST(string url, object data, bool gl)
    {
        var jsonData = JsonUtility.ToJson(data);
        Debug.Log("POST to " + url + " data: " + jsonData);
        
        var request = new UnityWebRequest(url + "/", "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        Debug.Log(request.GetRequestHeader("AUTHORIZATION"));

        await request.SendWebRequest();
        await UniTask.WaitUntil(() => request.isDone);
        if (request.isHttpError)
            return (new Tuple<bool, string>(false, request.error));
        else
            return (new Tuple<bool, string>(true, request.downloadHandler.text));
    }
    #endregion
}
