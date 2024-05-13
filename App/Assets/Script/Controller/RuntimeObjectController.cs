using Cysharp.Threading.Tasks;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class RuntimeObjectController : MonoBehaviour
{
    [SerializeField] private float introTime;
    [SerializeField] private CanvasGroup canvasGroup;

    private async void Start()
    {
        DontDestroyOnLoad(gameObject);

        await UniTask.Delay((int)(introTime * 1000));
        SceneManager.LoadScene("SignIn", LoadSceneMode.Single);
    }

    private void Update()
    {
        if (canvasGroup)
            canvasGroup.alpha += 1 / (introTime - 1) * Time.deltaTime;
    }
}
