using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RuntimeObjectController : MonoBehaviour
{
    void Start()
    {
        DontDestroyOnLoad(gameObject);
    }
}
