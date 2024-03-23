using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

static class CustomJson<T>
{
    [Serializable]
    public struct TempSruct
    {
        public List<T> list;
    }

    public static List<T> ParseList(string json)
    {
        return JsonUtility.FromJson<TempSruct>("{ \"list\": " + json + "}").list;
    }
}
