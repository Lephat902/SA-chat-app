using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

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

    private static async Task<HttpResponseMessage> GET(string url)
    {
        using (var client = new HttpClient())
        {
            var respone = await client.GetAsync(url);

            Debug.Log("GET from " + url);
            return respone;
        }
    }
}
