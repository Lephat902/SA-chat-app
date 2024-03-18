using Cysharp.Threading.Tasks;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

public static class StaticURL
{
    public const string DOMAIN = "https://chatapp.tutorify.site";

    public static async Task<HttpResponseMessage> POST(string url, object data)
    {
        using (var client = new HttpClient())
        {
            var response = await client.PostAsync(url,
                new StringContent(JsonUtility.ToJson(data),
                Encoding.UTF8, "application/json"));

            return response;
        }
    }
}
