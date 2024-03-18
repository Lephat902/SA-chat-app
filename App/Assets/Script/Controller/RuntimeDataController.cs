using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RuntimeDataController : MonoBehaviour
{
    [SerializeField] private List<ScriptableObject> scriptableObjects;
    
    void Start()
    {
        DontDestroyOnLoad(gameObject);
    }
}
